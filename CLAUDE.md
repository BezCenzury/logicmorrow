# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Zasady języka i tonu copy

Odbiorca strony to **CEO / Dyrektor Operacyjny / właściciel firmy 5–35 osób** — decydent biznesowy, często nietech­niczny. Czyta stronę żeby sprawdzić, czy LogicMorrow rozwiąże jego problem, a nie żeby poznać technologię.

### Zakaz żargonu IT

Nigdy nie używaj tych sformułowań w treściach widocznych dla klienta:

| Zakazane | Zamiennik |
|---|---|
| on-premise | na Twoich własnych serwerach / bezpośrednio u Ciebie |
| infrastruktura | serwery, system |
| stack technologiczny | narzędzia, z których korzystamy |
| węzły / nodes | kroki, etapy, połączenia |
| scenariusze (n8n) | automatyzacje, przepływy |
| skalowanie | wzrost, rosnące obciążenie |
| optymalizacja API | połączenie z systemem |
| orkiestracja procesów | zarządzanie przepływem pracy |
| source-available | otwarty kod |
| Enterprise Service Bus | — (nie używaj wcale) |
| dedykowana, odizolowana infrastruktura | prywatny, wydzielony serwer |

### Język korzyści, nie funkcji

Piszemy **co klient zyska**, nie **co robi technologia**.

- Nie: "n8n obsługuje obsługę błędów przez Error Handling"
- Tak: "jeśli coś pójdzie nie tak, dostajesz powiadomienie i dane nie giną"

- Nie: "Standardy klasy Enterprise"
- Tak: "Bez niespodzianek. Bez haczyków."

### Pozycjonowanie: butikowy inżynier, nie agencja

- Komunikacja szczera i bezpośrednia — bez korporacyjnej nowomowy
- Nie nadużywamy słów: "innowacyjny", "kompleksowy", "holistyczny", "synergia"
- Konkretne liczby są lepsze niż przymiotniki ("15 minut → 3 sekundy" zamiast "znacznie szybciej")
- Obiekcje klienta zbijamy matematyką i konkretem, nie ogólnikami

### Wyjątek — kontekst techniczny

Nazwy narzędzi (n8n, Zapier, Make, Cal.com) i skróty branżowe (RODO, API, SLA) są dopuszczalne — klient je zna lub łatwo pogoogla. Nigdy nie tłumacz architektury wewnętrznej.

## Stack

Pure HTML + CSS + JS. No build tools, no npm, no bundler. Files are served as-is via GitHub Pages.

**To run locally:**
```bash
python -m http.server 8080
# lub: npx serve .
# lub: VS Code Live Server extension
```

Paths are absolute (`/css/base/variables.css`, `/components/navbar.html`), więc strona musi być serwowana przez serwer HTTP — otwieranie `index.html` bezpośrednio w przeglądarce (`file://`) złamie ładowanie komponentów.

## Architektura kluczowych mechanizmów

### Globalny Header i Footer — `js/loader.js`

Navbar i stopka **nie są wklejone statycznie** na żadnej podstronie. Są ładowane dynamicznie:

```
js/loader.js  →  fetch('/components/navbar.html')  →  innerHTML do #navbar-placeholder
              →  fetch('/components/footer.html')   →  innerHTML do #footer-placeholder
```

`js/navbar.js` (hamburger, active link, scroll) **musi być wywołany po** wstrzyknięciu navbar. Dlatego `loader.js` wywołuje `initNavbar()` po zakończeniu `fetch`.

Strona `konsultacja.html` ma `<body data-page="konsultacja">` — sygnał dla `loader.js`, żeby pominął pełny navbar (strona konwersyjna, bez menu).

### CSS — trzy poziomy

```
css/base/variables.css    ← JEDYNE ŹRÓDŁO PRAWDY dla kolorów, spacingów, gradientów
css/base/reset.css
css/base/typography.css

css/components/           ← navbar, footer, buttons, cards, badge
css/sections/             ← jeden plik per sekcja/typ podstrony
```

Każda podstrona w `<head>` ładuje tylko CSS, którego używa. Zmiana koloru brandowego = zmiana w `variables.css`, nie w każdym pliku.

### Animacje — `js/animations.js`

Oparte na Intersection Observer. Wystarczy dodać atrybut do elementu HTML:

```html
<div data-animate="fade-up">...</div>
<div data-animate="fade-in" data-delay="200">...</div>
```

Dostępne wartości: `fade-up`, `fade-in`, `slide-left`, `slide-right`. Style CSS są wstrzykiwane przez JS inline (brak osobnego pliku CSS).

### Kalkulator ROI — `js/roi-calculator.js`

Funkcja `initROICalculator()` szuka elementu `#roi-calculator` (form) i `#roi-result` (output). Jeśli nie istnieją, kończy działanie bez błędu. Aktywna tylko na `index.html`.

## Cookie Consent + Google Consent Mode V2

Zaimplementowany system: **orestbida/cookieconsent v3.0.1** + **GTM** + **GCM V2**. Działa na wszystkich podstronach bez wyjątku (łącznie z `konsultacja.html`).

### Pliki systemu

- `js/cookie-consent.js` — jedyne źródło logiki banera (cleanup localStorage + `CookieConsent.run()`). **Nie duplikuj tej logiki w HTML.**
- `polityka-prywatnosci.html` — strona polityki prywatności (do uzupełnienia treścią).

### Struktura na każdej nowej podstronie

**W `<head>` (PRZED `<!-- Fonts -->`):**

```html
<!-- ═══════════════════════════════════════════════════════
     COOKIE CONSENT + GOOGLE CONSENT MODE V2
     ═══════════════════════════════════════════════════════ -->

<!-- [1] Google Consent Mode V2 — domyślne zgody (MUST BE FIRST) -->
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

<!-- [3] Google Tag Manager — zastąp GTM-XXXXXXX docelowym ID -->
<script>(function(w,d,s,l,i){
    w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
    var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
    j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
    f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>

<!-- [4] Cookie Consent Library (orestbida/cookieconsent v3.0.1) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.0.1/dist/cookieconsent.css">
<script src="https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.0.1/dist/cookieconsent.umd.js"></script>

<!-- [5] Cookie Consent — kolory brand LogicMorrow -->
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
    #cc-main .cm--box { max-width: 33vw; min-width: 420px; }
    #cc-main .cm .cm__btns .cm-btn { padding: 0.85rem 1.5rem; font-size: 1rem; }
</style>
```

**Zaraz po `<body>`:**

```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
```

**Przed `</body>` (jako ostatni skrypt):**

```html
<!-- [6] Cookie Consent — inicjalizacja -->
<script src="/js/cookie-consent.js"></script>
```

### Wymiana GTM ID

Kiedy użytkownik poda numer kontenera GTM, zamień `GTM-XXXXXXX` we wszystkich plikach HTML oraz w `polityka-prywatnosci.html`. Placeholder `GTM-XXXXXXX` występuje po 3 razy w każdym pliku (Blok 3 w head, noscript po body, noscript w konsultacja nie ma — tam GTM działa przez head).

## Zasady edycji

- **Zmiana w navbar/footer:** edytuj wyłącznie `components/navbar.html` lub `components/footer.html`
- **Zmiana koloru/spacingu globalnie:** edytuj `css/base/variables.css` (CSS custom properties)
- **Nowa sekcja na istniejącej podstronie:** dodaj plik `css/sections/nazwa.css` i zlinkuj go w `<head>` tej podstrony
- **Nowa podstrona:** skopiuj strukturę `<head>` z istniejącej strony (zawiera już bloki cookie consent [1–5]), dodaj `#navbar-placeholder` i `#footer-placeholder`, załaduj `js/loader.js`, `js/navbar.js` i `/js/cookie-consent.js`

## Strona konsultacji — wyjątek architektoniczny

`konsultacja.html` celowo **nie ma menu nawigacyjnego** ani linków wychodzących. To jest strona konwersyjna — jedyna akcja to rezerwacja w kalendarzu. Nie dodawaj tam navbar. Widget kalendarza to Cal.com embed (placeholder do zastąpienia).

## Inwentarz podstron i ich sekcji

### `index.html` — Strona główna (centrum dowodzenia)
Pełny lejek TOFU→BOFU. CSS: hero, tech-stack, challenges, solutions, portfolio-teaser, qualifier, roi-calculator, manifesto, consultation, safety-standards.

| Sekcja | Klasa CSS | JS | Opis |
|---|---|---|---|
| Hero | `.hero` | `animations.js` (typewriter) | Nagłówek z typewriterem, przed/po SVG, CTA → konsultacja |
| Tech Stack | `.tech-stack` | — | Infinite-scroll karuzela technologii (CSS animation) |
| Wyzwania | `.challenges` | `animations.js` | 6 kart problemów klientów |
| Rozwiązania | `.solutions` | `solutions.js` | 3 zakładki: automatyzacje/aplikacje/agenci AI z SVG |
| Portfolio | `.portfolio-teaser` | — | 3 karty z placeholderami wideo |
| Kwalifikator | `.qualifier` | `animations.js` | Dla kogo jest / dla kogo nie jest |
| Kalkulator ROI | `.roi-calculator` | `roi-calculator.js` | 3 suwaki → wyliczenie kosztu manualu |
| Manifest | `.manifesto` | `animations.js` | Tabela porównawcza: Agencja vs LogicMorrow |
| Formularz kontaktowy | `.consultation` | inline script | Formularz z honeypot bot-protection |
| Safety Standards | `.safety-standards` | `animations.js` | 3 karty: on-premise, monitoring, shadow run |

### `automatyzacje.html` — Automatyzacja procesów (n8n)
Hero z animowanym SVG orbitalnym (6 węzłów: Slack, Notion, Drive, OpenAI, n8n, Trello). CSS: hero, challenges, solutions, use-cases, safety-standards, process-model, faq.

| Sekcja | Klasa CSS | JS | Opis |
|---|---|---|---|
| Hero | `.hero--overlap` | `animations.js` | SVG orbitalny, CTA → konsultacja |
| Wyzwania | `.challenges` | `animations.js` | 3 problemy: kopiuj-wklej, excel-bóg, powtarzalność |
| Rozwiązania | `.solutions` | `solutions.js` | 3 zakładki: codzienne/integracje/analityka |
| Przypadki użycia | `.use-cases` | `animations.js` | 3 karty przed/po: onboarding, faktury, leady |
| Model procesu | `.process-model` | `animations.js` | 4 kroki współpracy |
| FAQ | `.faq-section` | `faq.js` | 5 pytań w accordion (aria-expanded zarządzane przez faq.js) |

### `aplikacje.html` — Dedykowane aplikacje webowe
Hero skupiony na zastąpieniu Excela. CSS: hero, challenges, solutions, safety-standards, process-model, consultation, faq.

| Sekcja | Klasa CSS | JS | Opis |
|---|---|---|---|
| Hero | `.hero--subpage` | `animations.js` | Krótszy hero, skupiony na braku Excela |
| Wyzwania | `.challenges` | `animations.js` | 3 problemy: rysunki tech, brakujące detale, marża w locie |
| Rozwiązania | `.solutions` | `solutions.js` | 3 zakładki: integracje punktowe/migracja/pełny system (LogicMorrow OS SVG) |
| Safety | `.safety-standards` | `animations.js` | Płacisz raz, standard rynkowy JS/TS, on-premise RODO |
| Model procesu | `.process-model` | `animations.js` | 4 kroki: konsultacja → analiza → budowa → wdrożenie |
| Formularz | `.consultation` | — | Light-theme form |
| FAQ | `.faq-section` | `faq.js` | 5 pytań: koszt/czas/SaaS vs custom/UX/bezpieczeństwo |

### `konsultacja.html` — Strona konwersyjna (WYJĄTEK)
`<body data-page="konsultacja">` — brak pełnego navbar, brak stopki globalnej. Minimalistyczny layout 2-kolumnowy: agenda konsultacji + placeholder Cal.com. CSS: booking.css.

### `model-pracy.html` — Model pracy i gwarancje
PoC 4-krokowy + 6 kart gwarancji (własność kodu, stała cena, brak vendor lock-in, jeden kontakt, shadow run, dane w infrastrukturze klienta). CSS: hero, process-model, safety-standards, roadmap.

### `rozwiazania.html` — Biblioteka procesów (portfolio)
Filtry (Wszystkie/Sprzedaż/Operacje/Produkcja/Aplikacje) + 3 placeholder karty z wideo. Filter logic: inline JS w DOMContentLoaded. CSS: hero, library.

### `agenci.html` — Agenci AI
Pełna podstrona: hero z SVG + sekcja wyzwań + 3 zakładki możliwości (Analityk/Operacyjny/Ekspert) + bezpieczeństwo + model wdrożenia (4 kroki) + formularz kontaktowy + FAQ. CSS: hero, challenges, solutions, safety-standards, process, consultation, faq.

## Zawartość `Baza wiedzy o firmie/`

Pliki `.md` z briefem firmy, obiekcjami klientów i strategią strony. Nie trafiają na GitHub (`.gitignore`). Czytaj je przed tworzeniem copy lub nowych sekcji.

- `logicmorrow.pl.md` — główny brief projektu i wymagania techniczne
- `strukturalogicmorrow.md` — strategia strony, architektura informacji, UX Writing
- `firmalogicmorrow.md` — opis działalności firmy
- `listaobiekcje.md` — obiekcje klientów do zbijania na stronie

## Skille Claude Code

Folder `.claude/` zawiera skille (np. `/seo` — audyt SEO dla stron statycznych). Nie trafia na GitHub.
