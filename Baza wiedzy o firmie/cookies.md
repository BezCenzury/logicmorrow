# cookies.md — Instrukcja implementacji banera cookie + Google Consent Mode V2

> Plik wzorcowy oparty na działającym wdrożeniu: systemtargowy.pl (static HTML + GitHub Pages).
> Stosowany stack: orestbida/cookieconsent v3, Google Tag Manager, Google Consent Mode V2.
> Plik do przenoszenia między projektami jako punkt startowy.

---

## Spis treści

1. [Diagram przepływu](#1-diagram-przepływu)
2. [Zasada działania — dlaczego kolejność ma znaczenie](#2-zasada-działania--dlaczego-kolejność-ma-znaczenie)
3. [Blok 1 — Google Consent Mode V2: wartości domyślne](#3-blok-1--google-consent-mode-v2-wartości-domyślne)
4. [Blok 2 — Pre-inicjalizacja consent dla powracających użytkowników](#4-blok-2--pre-inicjalizacja-consent-dla-powracających-użytkowników)
5. [Blok 3 — Google Tag Manager](#5-blok-3--google-tag-manager)
6. [Blok 4 — CSS i JS biblioteki CookieConsent](#6-blok-4--css-i-js-biblioteki-cookieconsent)
7. [Blok 5 — Stylizacja banera (CSS variables)](#7-blok-5--stylizacja-banera-css-variables)
8. [Blok 6 — Inicjalizacja CookieConsent (dolna część body)](#8-blok-6--inicjalizacja-cookieconsent-dolna-część-body)
9. [Obsługa skasowania cc_cookie (localStorage cleanup)](#9-obsługa-skasowania-cc_cookie-localstorage-cleanup)
10. [Callbacki onConsent i onChange](#10-callbacki-onconsent-i-onchange)
11. [Fizyczne usuwanie cookies przy cofnięciu zgody](#11-fizyczne-usuwanie-cookies-przy-cofnięciu-zgody)
12. [Tabela kategorii cookies i ich opis](#12-tabela-kategorii-cookies-i-ich-opis)
13. [Znane pułapki i rozwiązane problemy](#13-znane-pułapki-i-rozwiązane-problemy)
14. [Checklista RODO / zgodność z Google](#14-checklista-rodo--zgodność-z-google)
15. [Pełny kompletny kod do wklejenia](#15-pełny-kompletny-kod-do-wklejenia)

---

## 1. Diagram przepływu

```
<head> — pierwsze linie
│
├── [1] gtag('consent','default', ALL DENIED) + wait_for_update: 2000
│       └── GTM czeka do 2 sek. na aktualizację zgody, zanim odpali tagi
│
├── [2] Odczyt cc_cookie z document.cookie (SYNC, przed GTM)
│       ├── cc_cookie istnieje → gtag('consent','update', GRANTY Z COOKIE)
│       └── cc_cookie brak    → brak aktualizacji, GTM startuje z DENIED
│
├── [3] GTM snippet (j.async = true)
│       └── GTM ładuje się, ale tagi analityki/reklam są zablokowane (DENIED)
│
├── [4] <link> cookieconsent.css
├── [4] <script> cookieconsent.umd.js  ← synchronicznie, przed </head>
└── [5] <style> CSS variables (kolory banera)

<body>
│
├── GTM noscript <iframe>
├── ... treść strony ...
│
└── [6] <script> CookieConsent.run({...})   ← dolna część body, przed </body>
        ├── Cleanup localStorage (gdy cc_cookie skasowane)
        ├── Konfiguracja GUI (box, middle center, overlay)
        ├── Kategorie: necessary (readOnly), analytics, marketing
        ├── Tłumaczenia PL
        ├── onConsent → gtag update + dataLayer event 'consent_ready'
        └── onChange  → gtag update + dataLayer event 'consent_update' + usuwanie cookies
```

---

## 2. Zasada działania — dlaczego kolejność ma znaczenie

**Problem:** GTM ładuje się asynchronicznie, ale może odpalić tagi analityczne zanim użytkownik wyrazi zgodę.

**Rozwiązanie — trzy warstwy ochrony:**

| Warstwa | Co robi | Kiedy |
|---------|---------|-------|
| `consent default` | Ustawia wszystkie storage na `denied` | Natychmiast przy starcie strony |
| `wait_for_update: 2000` | Każe GTM poczekać 2 sek. na aktualizację | Daje czas na odczyt cc_cookie |
| Pre-inicjalizacja | Odczytuje cc_cookie PRZED GTM | Powracający user → brak flashu banera |

**Kluczowa zasada:** `consent default` MUSI być przed snippetem GTM w kodzie HTML.

---

## 3. Blok 1 — Google Consent Mode V2: wartości domyślne

**Miejsce:** Absolutnie pierwsze `<script>` w `<head>`, przed wszystkim innym.

```html
<!-- Google Consent Mode V2 - Domyślne Ustawienia -->
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('consent', 'default', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'wait_for_update': 2000
    });
</script>
```

**Wyjaśnienie parametrów:**
- `analytics_storage` — blokuje Google Analytics (_ga, _gid, _ga_*)
- `ad_storage` — blokuje Google Ads, remarketing
- `ad_user_data` — blokuje wysyłanie danych użytkownika do Google Ads
- `ad_personalization` — blokuje personalizację reklam
- `wait_for_update: 2000` — GTM czeka 2000 ms zanim odpali tagi; daje czas na synchroniczny odczyt cc_cookie

**Uwaga V2:** Google Consent Mode V2 (od marca 2024) wymaga wszystkich 4 parametrów (w V1 były tylko `analytics_storage` + `ad_storage`). Bez `ad_user_data` i `ad_personalization` Google Ads nie będzie działać poprawnie.

---

## 4. Blok 2 — Pre-inicjalizacja consent dla powracających użytkowników

**Miejsce:** Tuż po Bloku 1, nadal przed GTM.

**Problem który rozwiązuje:** Powracający użytkownik, który już zaakceptował cookies, miał chwilowe opóźnienie — GTM startował z `denied`, potem po załadowaniu CookieConsent następowała aktualizacja. Powodowało to utratę pierwszego hitu GA.

```html
<!-- Szybka pre-inicjalizacja consent dla powracających użytkowników.
     Odczytuje ciasteczko cc_cookie PRZED załadowaniem GTM, dzięki czemu
     GTM już na starcie widzi poprawny stan zgody i odpala tagi bez opóźnienia. -->
<script>
    (function () {
        try {
            var raw = document.cookie.split(';').reduce(function (acc, c) {
                var p = c.trim().split('=');
                return p[0] === 'cc_cookie' ? decodeURIComponent(p.slice(1).join('=')) : acc;
            }, null);
            if (raw) {
                var cats = JSON.parse(raw).categories || [];
                var analytics = cats.indexOf('analytics') >= 0 ? 'granted' : 'denied';
                var marketing = cats.indexOf('marketing') >= 0 ? 'granted' : 'denied';
                gtag('consent', 'update', {
                    'analytics_storage': analytics,
                    'ad_storage': marketing,
                    'ad_user_data': marketing,
                    'ad_personalization': marketing
                });
            }
        } catch (e) { /* ignoruj błędy parsowania */ }
    })();
</script>
```

**Jak działa:**
1. Synchronicznie przeszukuje `document.cookie` w poszukiwaniu `cc_cookie`
2. Dekoduje URL-encoded wartość i parsuje JSON
3. Sprawdza tablicę `categories` w zapisanym cookie
4. Wywołuje `gtag('consent', 'update', ...)` zanim GTM się załaduje
5. Cały kod opakowany w `try/catch` — błędy parsowania nie psują strony

**Format cc_cookie (co zapisuje orestbida/cookieconsent):**
```json
{
  "categories": ["necessary", "analytics", "marketing"],
  "revision": 0,
  "data": null,
  "consentTimestamp": "...",
  "consentId": "...",
  "services": {}
}
```
Dla użytkownika który zaakceptował tylko niezbędne: `"categories": ["necessary"]`.

---

## 5. Blok 3 — Google Tag Manager

**Miejsce:** Po pre-inicjalizacji, nadal w `<head>`.

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){
    w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
    var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
    j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
    f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- End Google Tag Manager -->
```

Zastąp `GTM-XXXXXXX` swoim ID kontenera GTM.

**W `<body>` zaraz po `<body>`:**
```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

---

## 6. Blok 4 — CSS i JS biblioteki CookieConsent

**Miejsce:** W `<head>`, po GTM, przed zamknięciem `</head>`.

```html
<!-- Cookie Consent CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.0.1/dist/cookieconsent.css">
<!-- Cookie Consent JS (ładowane wcześnie dla poprawnej synchronizacji z GTM Consent Mode) -->
<script src="https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.0.1/dist/cookieconsent.umd.js"></script>
```

**Dlaczego JS synchronicznie w `<head>` a nie defer/async?**
- Biblioteka musi być dostępna (czyli `window.CookieConsent`) zanim wywoła się `CookieConsent.run()` w body
- Ładowanie w `<head>` bez `defer` blokuje parser, ale gwarantuje, że biblioteka jest gotowa
- Wersja UMD (`cookieconsent.umd.js`) eksponuje globalny `CookieConsent` na `window`

**Wersjonowanie:** Używaj konkretnej wersji `@3.0.1` zamiast `@latest` — zabezpiecza przed breaking changes.

---

## 7. Blok 5 — Stylizacja banera (CSS variables)

**Miejsce:** W `<head>`, po załadowaniu CSS biblioteki.

```html
<!-- Cookie Consent - styl i kolorystyka -->
<style>
    :root {
        /* Przycisk główny (Akceptuj wszystkie) – dostosuj do brand color */
        --cc-btn-primary-bg: #2563eb;
        --cc-btn-primary-hover-bg: #1d4ed8;
        --cc-btn-primary-text: #fff;
        /* Przyciski drugorzędne (Tylko niezbędne, Zarządzaj) */
        --cc-btn-secondary-bg: #f1f5f9;
        --cc-btn-secondary-hover-bg: #e2e8f0;
        --cc-btn-secondary-text: #475569;
        /* Toggle i linki */
        --cc-toggle-on-bg: #2563eb;
        --cc-link-color: #2563eb;
        --cc-btn-border-radius: 0.75rem;
        --cc-overlay-bg: rgba(0, 0, 0, 0.55);
    }
    /* Szerokość banera consent na ~1/3 ekranu (desktop) */
    #cc-main .cm--box {
        max-width: 33vw;
        min-width: 420px;
    }
    /* Większe przyciski */
    #cc-main .cm .cm__btns .cm-btn {
        padding: 0.85rem 1.5rem;
        font-size: 1rem;
    }
</style>
```

**Pełna lista CSS variables dostępna pod:** https://cookieconsent.orestbida.com/reference/css-variables.html

---

## 8. Blok 6 — Inicjalizacja CookieConsent (dolna część body)

**Miejsce:** Na końcu `<body>`, przed `</body>`. MUSI być po załadowaniu wszystkich skryptów.

### 8a. Cleanup localStorage (KRYTYCZNE)

```javascript
// Jeśli cc_cookie zostało skasowane z przeglądarki, wyczyść localStorage
// żeby biblioteka nie pamiętała starego stanu i pokazała baner od nowa
(function () {
    var hasCookie = document.cookie.split(';').some(function (c) {
        return c.trim().indexOf('cc_cookie=') === 0;
    });
    if (!hasCookie && window.localStorage) {
        Object.keys(localStorage).filter(function (k) {
            return k.indexOf('cc_') === 0 || k === 'cookieconsent';
        }).forEach(function (k) {
            localStorage.removeItem(k);
        });
    }
})();
```

**Dlaczego to jest konieczne?**
orestbida/cookieconsent v3 używa zarówno cookie (`cc_cookie`) jak i `localStorage` do zapamiętywania stanu. Jeśli użytkownik ręcznie skasuje `cc_cookie` (lub wygaśnie), ale pozostanie wpis w `localStorage`, biblioteka nie pokaże banera ponownie. Ten fragment naprawia ten problem: sprawdza czy `cc_cookie` istnieje — jeśli nie, czyści powiązane klucze z `localStorage`.

### 8b. CookieConsent.run() — pełna konfiguracja

```javascript
CookieConsent.run({
    guiOptions: {
        consentModal: {
            layout: 'box',
            position: 'middle center',  // wyśrodkowany, blokujący overlay
            equalWeightButtons: false,  // "Akceptuj" wyróżniony, reszta szara
            flipButtons: false
        },
        preferencesModal: {
            layout: 'box',
            position: 'right',
            equalWeightButtons: false,
            flipButtons: false
        }
    },
    categories: {
        necessary: { readOnly: true },  // zawsze włączone, bez togglea
        analytics: {},
        marketing: {}
    },
    language: {
        default: 'pl',
        autoDetect: 'browser',  // auto-detect języka przeglądarki
        translations: {
            pl: {
                consentModal: {
                    title: 'Dostosuj preferencje dotyczące zgody',
                    description: 'Używamy plików cookie, aby zapewnić prawidłowe działanie strony...',
                    acceptAllBtn: 'Akceptuj wszystkie',
                    acceptNecessaryBtn: 'Tylko niezbędne',
                    showPreferencesBtn: 'Zarządzaj opcjami',
                    footer: '<a href="polityka-prywatnosci.html" target="_blank">Polityka Prywatności</a>'
                },
                preferencesModal: {
                    title: 'Preferencje plików cookies',
                    acceptAllBtn: 'Akceptuj wszystkie',
                    acceptNecessaryBtn: 'Tylko niezbędne',
                    savePreferencesBtn: 'Zapisz ustawienia',
                    closeIconLabel: 'Zamknij okno',
                    sections: [
                        {
                            title: 'Niezbędne pliki cookies',
                            description: 'Niezbędne pliki cookie mają kluczowe znaczenie...',
                            linkedCategory: 'necessary',
                            cookieTable: {
                                headers: { name: 'Plik cookie', duration: 'Czas trwania', description: 'Opis' },
                                body: [
                                    {
                                        name: 'cc_cookie',
                                        duration: '1 rok',
                                        description: 'CookieConsent ustawia ten plik cookie w celu zapamiętania preferencji zgody.'
                                    }
                                ]
                            }
                        },
                        {
                            title: 'Analityka',
                            description: 'Analityczne pliki cookie służą do zrozumienia...',
                            linkedCategory: 'analytics',
                            cookieTable: {
                                headers: { name: 'Plik cookie', duration: 'Czas trwania', description: 'Opis' },
                                body: [
                                    { name: '_ga',      duration: '1 rok 1 miesiąc', description: 'Google Analytics — identyfikator użytkownika.' },
                                    { name: '_ga_*',    duration: '1 rok 1 miesiąc', description: 'Google Analytics 4 — licznik odsłon.' },
                                    { name: '_gid',     duration: '1 dzień',         description: 'Google Analytics — sesja, reset co 24h.' },
                                    { name: '_gat_UA-*',duration: '1 minuta',        description: 'Throttling requestów do GA.' }
                                ]
                            }
                        },
                        {
                            title: 'Marketing',
                            description: 'Reklamowe pliki cookie służą do spersonalizowanych reklam...',
                            linkedCategory: 'marketing',
                            cookieTable: {
                                headers: { name: 'Plik cookie', duration: 'Czas trwania', description: 'Opis' },
                                body: [
                                    { name: '_fbp',    duration: '3 miesiące', description: 'Meta/Facebook — remarketingowy.' },
                                    { name: '_gcl_au', duration: '3 miesiące', description: 'Google Ads — skuteczność reklam.' }
                                ]
                            }
                        }
                    ]
                }
            }
        }
    },

    onConsent: function ({ cookie }) { /* patrz Blok 10 */ },
    onChange: function ({ cookie, changedCategories }) { /* patrz Blok 10 */ }
});
```

---

## 9. Obsługa skasowania cc_cookie (localStorage cleanup)

Opisane w sekcji 8a. Kluczowe detale:

- Sprawdzana jest **obecność cookie** `cc_cookie` (nie jego wartość)
- Kasowane są klucze localStorage zaczynające się od `cc_` lub równe `cookieconsent`
- Musi być wywołane **przed** `CookieConsent.run()`, bo `run()` przy starcie sprawdza localStorage
- Owinąć w IIFE (immediately invoked function expression) żeby nie zanieczyszczać globalnego scope

**Scenariusz:** User kasuje `cc_cookie` w DevTools → odświeża stronę → bez cleanup banera nie ma → z cleanup baner wraca.

---

## 10. Callbacki onConsent i onChange

### onConsent — wywoływany przy PIERWSZEJ zgodzie lub przy załadowaniu gdy zgoda już istnieje

```javascript
onConsent: function ({ cookie }) {
    let analyticsStatus = cookie.categories.includes('analytics') ? 'granted' : 'denied';
    let marketingStatus = cookie.categories.includes('marketing') ? 'granted' : 'denied';

    // Aktualizacja Google Consent Mode
    gtag('consent', 'update', {
        'analytics_storage': analyticsStatus,
        'ad_storage': marketingStatus,
        'ad_user_data': marketingStatus,
        'ad_personalization': marketingStatus
    });

    // Wysłanie zdarzenia do GTM (setTimeout 0 = po zakończeniu callbacka)
    setTimeout(function () {
        dataLayer.push({
            'event': 'consent_ready',
            'consent_analytics': analyticsStatus,
            'consent_marketing': marketingStatus
        });
    }, 0);
},
```

**Dlaczego `setTimeout(fn, 0)` przy dataLayer.push?**
Zapewnia, że `gtag('consent', 'update')` zostanie przetworzone przez GTM zanim zdarzenie `consent_ready` wyzwoli tagi. Bez tego GTM może odebrać zdarzenie przed aktualizacją consent state.

### onChange — wywoływany gdy użytkownik ZMIENIA preferencje

```javascript
onChange: function ({ cookie, changedCategories }) {
    let analyticsStatus = cookie.categories.includes('analytics') ? 'granted' : 'denied';
    let marketingStatus = cookie.categories.includes('marketing') ? 'granted' : 'denied';

    gtag('consent', 'update', {
        'analytics_storage': analyticsStatus,
        'ad_storage': marketingStatus,
        'ad_user_data': marketingStatus,
        'ad_personalization': marketingStatus
    });

    // setTimeout 500 ms — daje więcej czasu GTM na przetworzenie zmiany consent
    setTimeout(function () {
        dataLayer.push({
            'event': 'consent_update',
            'consent_analytics': analyticsStatus,
            'consent_marketing': marketingStatus
        });
    }, 500);

    // Fizyczne czyszczenie cookies gdy zgoda cofnięta (patrz Blok 11)
},
```

**Różnica `setTimeout` między callbackami:**
- `onConsent`: `setTimeout(fn, 0)` — minimalne opóźnienie, wystarczy na nowego usera
- `onChange`: `setTimeout(fn, 500)` — dłuższe opóźnienie przy zmianie, bo GTM musi przetworzyć nowy stan consent i dopiero potem wyczyścić tagi

---

## 11. Fizyczne usuwanie cookies przy cofnięciu zgody

Samo `gtag('consent', 'update', 'denied')` NIE usuwa już ustawionych cookies — tylko blokuje nowe. Trzeba to zrobić ręcznie w callbacku `onChange`.

```javascript
// W onChange, po aktualizacji gtag:

// Kasowanie cookies analityki
if (changedCategories.includes('analytics') && analyticsStatus === 'denied') {
    document.cookie.split(";").forEach(function (c) {
        let name = c.trim().split("=")[0];
        if (name.startsWith('_ga') || name.startsWith('_gid')) {
            // Kasuj na root path
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            // Kasuj też na root domain (z kropką) dla subdomian
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." +
                window.location.hostname.replace('www.', '') + ";";
        }
    });
}

// Kasowanie cookies marketingowych
if (changedCategories.includes('marketing') && marketingStatus === 'denied') {
    document.cookie.split(";").forEach(function (c) {
        let name = c.trim().split("=")[0];
        if (name.startsWith('_fbp') || name.startsWith('_gcl')) {
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." +
                window.location.hostname.replace('www.', '') + ";";
        }
    });
}
```

**Dlaczego dwie linie dla każdego cookie?**
Cookies mogą być ustawione z domeną `example.com` lub `.example.com`. Trzeba kasować oba warianty. `window.location.hostname.replace('www.', '')` daje czystą domenę root.

**Prefixes do kasowania wg biblioteki:**
| Kategoria | Prefixes cookies |
|-----------|-----------------|
| Google Analytics | `_ga`, `_gid`, `_ga_*`, `_gat_UA-*` |
| Google Ads | `_gcl_au`, `_gcl_*` |
| Facebook/Meta | `_fbp`, `_fbc` |

---

## 12. Tabela kategorii cookies i ich opis

### Niezbędne (necessary — readOnly: true)
| Cookie | Czas | Opis |
|--------|------|------|
| `cc_cookie` | 1 rok | Stan zgody cookie — ustawiony przez orestbida/cookieconsent |

### Analityczne (analytics)
| Cookie | Czas | Opis |
|--------|------|------|
| `_ga` | 1 rok 1 mies. | Google Analytics — losowy ID użytkownika |
| `_ga_*` | 1 rok 1 mies. | GA4 — licznik sesji i odsłon |
| `_gid` | 1 dzień | GA — sesja (reset co 24h) |
| `_gat_UA-*` | 1 minuta | Throttling requestów do GA |

### Marketingowe (marketing)
| Cookie | Czas | Opis |
|--------|------|------|
| `_fbp` | 3 miesiące | Meta/Facebook Pixel — remarketing |
| `_gcl_au` | 3 miesiące | Google Ads — conversion tracking |

---

## 13. Znane pułapki i rozwiązane problemy

### Problem: Baner nie wraca po ręcznym skasowaniu cc_cookie
**Przyczyna:** Biblioteka sprawdza localStorage przed sprawdzeniem cookie. Stan w localStorage mówi "consent udzielony" nawet gdy cookie nie istnieje.  
**Rozwiązanie:** Cleanup localStorage (sekcja 8a/9) PRZED wywołaniem `CookieConsent.run()`.

### Problem: Baner wraca przy każdym odświeżeniu (blink)
**Przyczyna:** `lazyHtmlGeneration: true` (stara opcja) powodowała że DOM banera był generowany asynchronicznie i baner flashował.  
**Rozwiązanie:** Nie używać `lazyHtmlGeneration: false` — w v3.0.1 ta opcja nie istnieje; problem był specyficzny dla starszych wersji. Aktualnie wystarczy `CookieConsent.run()` na dole body.

### Problem: GTM odpala tagi analityczne zanim baner się pokaże
**Przyczyna:** Brak `consent default` przed GTM snippetem, lub `wait_for_update` zbyt krótki.  
**Rozwiązanie:** Blok 1 (consent default) MUSI być przed Blokiem 3 (GTM). `wait_for_update: 2000` daje 2 sekundy.

### Problem: Powracający użytkownik traci pierwszy hit GA (double-consent delay)
**Przyczyna:** GTM ładuje się z `denied`, potem CookieConsent inicjalizuje się i updatuje — między nimi jest okno gdzie GA nie zbiera.  
**Rozwiązanie:** Blok 2 (pre-inicjalizacja) synchronicznie odczytuje cc_cookie PRZED GTM snippetem.

### Problem: dataLayer.push('consent_ready') odpala tag zanim consent update dotarł do GTM
**Przyczyna:** GTM przetwarza zdarzenia i consent asynchronicznie.  
**Rozwiązanie:** `setTimeout(fn, 0)` w onConsent, `setTimeout(fn, 500)` w onChange — daje GTM czas.

### Problem: Cookies GA pozostają po cofnięciu zgody
**Przyczyna:** `gtag consent denied` blokuje nowe cookies, ale nie usuwa starych.  
**Rozwiązanie:** Ręczne kasowanie cookies w callbacku onChange (sekcja 11).

---

## 14. Checklista RODO / zgodność z Google

### RODO (GDPR)
- [ ] Domyślny stan: wszystkie nieobowiązkowe = DENIED (opt-in, nie opt-out)
- [ ] Baner blokuje stronę (overlay) lub wyraźnie widoczny — użytkownik musi wyrazić zgodę
- [ ] Trzy opcje: "Akceptuj wszystkie", "Tylko niezbędne", "Zarządzaj opcjami"
- [ ] W "Zarządzaj opcjami" granularny wybór kategorii z opisem każdej
- [ ] Link do Polityki Prywatności w stopce banera
- [ ] Możliwość zmiany zgody w każdej chwili (link w footerze strony np. "Zarządzaj cookies")
- [ ] Tabela cookies dla każdej kategorii z nazwą, czasem trwania, opisem
- [ ] Stan zgody przechowywany na 1 rok (cc_cookie)
- [ ] Przy cofnięciu zgody — fizyczne usunięcie cookies

### Google Consent Mode V2 (wymagane od marca 2024 dla Google Ads i GA4)
- [ ] Cztery parametry: `analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`
- [ ] `consent default` przed snippetem GTM
- [ ] `wait_for_update` ustawiony
- [ ] `gtag('consent', 'update')` wywoływany w onConsent i onChange
- [ ] Zdarzenie `consent_ready` w dataLayer po udzieleniu zgody
- [ ] GTM skonfigurowany do respektowania Consent Mode (tagi z trybem "Basic" lub "Advanced")

### Dodatkowe
- [ ] Strona polityki prywatności istnieje i jest aktualna
- [ ] W polityce wymienione są wszystkie używane cookies
- [ ] Baner dostępny na WSZYSTKICH podstronach, nie tylko index.html

---

## 15. Pełny kompletny kod do wklejenia

Szablon dla nowego projektu. Zastąp:
- `GTM-XXXXXXX` → ID kontenera GTM
- `#2563eb` / `#1d4ed8` → kolor brand
- URL polityki prywatności
- Nazwy/opisy cookies dla konkretnych narzędzi

### W `<head>` (w tej kolejności):

```html
<!-- ═══════════════════════════════════════════════════
     COOKIE CONSENT + GOOGLE CONSENT MODE V2
     ═══════════════════════════════════════════════════ -->

<!-- [1] Google Consent Mode V2 - Domyślne Ustawienia (MUST BE FIRST) -->
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('consent', 'default', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'wait_for_update': 2000
    });
</script>

<!-- [2] Pre-inicjalizacja consent dla powracających użytkowników -->
<script>
    (function () {
        try {
            var raw = document.cookie.split(';').reduce(function (acc, c) {
                var p = c.trim().split('=');
                return p[0] === 'cc_cookie' ? decodeURIComponent(p.slice(1).join('=')) : acc;
            }, null);
            if (raw) {
                var cats = JSON.parse(raw).categories || [];
                var analytics = cats.indexOf('analytics') >= 0 ? 'granted' : 'denied';
                var marketing = cats.indexOf('marketing') >= 0 ? 'granted' : 'denied';
                gtag('consent', 'update', {
                    'analytics_storage': analytics,
                    'ad_storage': marketing,
                    'ad_user_data': marketing,
                    'ad_personalization': marketing
                });
            }
        } catch (e) {}
    })();
</script>

<!-- [3] Google Tag Manager -->
<script>(function(w,d,s,l,i){
    w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
    var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
    j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
    f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>

<!-- [4] Cookie Consent Library -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.0.1/dist/cookieconsent.css">
<script src="https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.0.1/dist/cookieconsent.umd.js"></script>

<!-- [5] Cookie Consent - Stylizacja (dostosuj kolory do brand) -->
<style>
    :root {
        --cc-btn-primary-bg: #2563eb;
        --cc-btn-primary-hover-bg: #1d4ed8;
        --cc-btn-primary-text: #fff;
        --cc-btn-secondary-bg: #f1f5f9;
        --cc-btn-secondary-hover-bg: #e2e8f0;
        --cc-btn-secondary-text: #475569;
        --cc-toggle-on-bg: #2563eb;
        --cc-link-color: #2563eb;
        --cc-btn-border-radius: 0.75rem;
        --cc-overlay-bg: rgba(0, 0, 0, 0.55);
    }
    #cc-main .cm--box {
        max-width: 33vw;
        min-width: 420px;
    }
    #cc-main .cm .cm__btns .cm-btn {
        padding: 0.85rem 1.5rem;
        font-size: 1rem;
    }
</style>
```

### Na początku `<body>`:

```html
<!-- GTM noscript (zaraz po <body>) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
```

### Na końcu `<body>`, przed `</body>`:

```html
<!-- [6] Skrypt Cookie Consent -->
<script>
    // Cleanup localStorage gdy cc_cookie skasowane
    (function () {
        var hasCookie = document.cookie.split(';').some(function (c) {
            return c.trim().indexOf('cc_cookie=') === 0;
        });
        if (!hasCookie && window.localStorage) {
            Object.keys(localStorage).filter(function (k) {
                return k.indexOf('cc_') === 0 || k === 'cookieconsent';
            }).forEach(function (k) { localStorage.removeItem(k); });
        }
    })();

    CookieConsent.run({
        guiOptions: {
            consentModal: {
                layout: 'box',
                position: 'middle center',
                equalWeightButtons: false,
                flipButtons: false
            },
            preferencesModal: {
                layout: 'box',
                position: 'right',
                equalWeightButtons: false,
                flipButtons: false
            }
        },
        categories: {
            necessary: { readOnly: true },
            analytics: {},
            marketing: {}
        },
        language: {
            default: 'pl',
            autoDetect: 'browser',
            translations: {
                pl: {
                    consentModal: {
                        title: 'Dostosuj preferencje dotyczące zgody',
                        description: 'Używamy plików cookie, aby zapewnić prawidłowe działanie strony. Pliki niezbędne są zawsze aktywne. Pliki analityczne i marketingowe wymagają Twojej zgody.',
                        acceptAllBtn: 'Akceptuj wszystkie',
                        acceptNecessaryBtn: 'Tylko niezbędne',
                        showPreferencesBtn: 'Zarządzaj opcjami',
                        footer: '<a href="polityka-prywatnosci.html" target="_blank">Polityka Prywatności</a>'
                    },
                    preferencesModal: {
                        title: 'Preferencje plików cookies',
                        acceptAllBtn: 'Akceptuj wszystkie',
                        acceptNecessaryBtn: 'Tylko niezbędne',
                        savePreferencesBtn: 'Zapisz ustawienia',
                        closeIconLabel: 'Zamknij okno',
                        sections: [
                            {
                                title: 'Niezbędne pliki cookies',
                                description: 'Niezbędne pliki cookie są wymagane do działania strony. Nie można ich wyłączyć.',
                                linkedCategory: 'necessary',
                                cookieTable: {
                                    headers: { name: 'Plik cookie', duration: 'Czas trwania', description: 'Opis' },
                                    body: [
                                        { name: 'cc_cookie', duration: '1 rok', description: 'Zapamiętuje preferencje zgody na pliki cookie.' }
                                    ]
                                }
                            },
                            {
                                title: 'Analityka',
                                description: 'Pozwalają analizować korzystanie ze strony (Google Analytics).',
                                linkedCategory: 'analytics',
                                cookieTable: {
                                    headers: { name: 'Plik cookie', duration: 'Czas trwania', description: 'Opis' },
                                    body: [
                                        { name: '_ga',       duration: '1 rok 1 mies.', description: 'Google Analytics — ID użytkownika.' },
                                        { name: '_ga_*',     duration: '1 rok 1 mies.', description: 'Google Analytics 4 — licznik sesji.' },
                                        { name: '_gid',      duration: '1 dzień',        description: 'Google Analytics — sesja.' },
                                        { name: '_gat_UA-*', duration: '1 minuta',       description: 'Throttling GA.' }
                                    ]
                                }
                            },
                            {
                                title: 'Marketing',
                                description: 'Służą do wyświetlania spersonalizowanych reklam.',
                                linkedCategory: 'marketing',
                                cookieTable: {
                                    headers: { name: 'Plik cookie', duration: 'Czas trwania', description: 'Opis' },
                                    body: [
                                        { name: '_fbp',    duration: '3 miesiące', description: 'Meta Pixel — remarketing.' },
                                        { name: '_gcl_au', duration: '3 miesiące', description: 'Google Ads — skuteczność reklam.' }
                                    ]
                                }
                            }
                        ]
                    }
                }
            }
        },

        onConsent: function ({ cookie }) {
            let analyticsStatus = cookie.categories.includes('analytics') ? 'granted' : 'denied';
            let marketingStatus = cookie.categories.includes('marketing') ? 'granted' : 'denied';
            gtag('consent', 'update', {
                'analytics_storage': analyticsStatus,
                'ad_storage': marketingStatus,
                'ad_user_data': marketingStatus,
                'ad_personalization': marketingStatus
            });
            setTimeout(function () {
                dataLayer.push({
                    'event': 'consent_ready',
                    'consent_analytics': analyticsStatus,
                    'consent_marketing': marketingStatus
                });
            }, 0);
        },

        onChange: function ({ cookie, changedCategories }) {
            let analyticsStatus = cookie.categories.includes('analytics') ? 'granted' : 'denied';
            let marketingStatus = cookie.categories.includes('marketing') ? 'granted' : 'denied';
            gtag('consent', 'update', {
                'analytics_storage': analyticsStatus,
                'ad_storage': marketingStatus,
                'ad_user_data': marketingStatus,
                'ad_personalization': marketingStatus
            });
            setTimeout(function () {
                dataLayer.push({
                    'event': 'consent_update',
                    'consent_analytics': analyticsStatus,
                    'consent_marketing': marketingStatus
                });
            }, 500);

            if (changedCategories.includes('analytics') && analyticsStatus === 'denied') {
                document.cookie.split(";").forEach(function (c) {
                    let name = c.trim().split("=")[0];
                    if (name.startsWith('_ga') || name.startsWith('_gid')) {
                        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." +
                            window.location.hostname.replace('www.', '') + ";";
                    }
                });
            }
            if (changedCategories.includes('marketing') && marketingStatus === 'denied') {
                document.cookie.split(";").forEach(function (c) {
                    let name = c.trim().split("=")[0];
                    if (name.startsWith('_fbp') || name.startsWith('_gcl')) {
                        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." +
                            window.location.hostname.replace('www.', '') + ";";
                    }
                });
            }
        }
    });
</script>
```

---

*Wzorzec: systemtargowy.pl — stan z 2026-04-01*
*Stack: orestbida/cookieconsent v3.0.1 + GTM + Google Consent Mode V2*
