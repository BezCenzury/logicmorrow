/* ============================================================
   COOKIE CONSENT — Inicjalizacja
   orestbida/cookieconsent v3.0.1 + Google Consent Mode V2

   Ładowany na końcu <body> każdej podstrony.
   Zakłada że CookieConsent (UMD) jest już dostępny globalnie
   (załadowany synchronicznie w <head> przez Blok 4).
   ============================================================ */

// Cleanup localStorage gdy cc_cookie zostało ręcznie skasowane —
// bez tego biblioteka nie pokazałaby banera ponownie.
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
                    footer: '<a href="/polityka-prywatnosci.html" target="_blank">Polityka Prywatności</a>'
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
        var analyticsStatus = cookie.categories.includes('analytics') ? 'granted' : 'denied';
        var marketingStatus = cookie.categories.includes('marketing') ? 'granted' : 'denied';
        gtag('consent', 'update', {
            'analytics_storage': analyticsStatus,
            'ad_storage': marketingStatus,
            'ad_user_data': marketingStatus,
            'ad_personalization': marketingStatus
        });
        // setTimeout 0 — daje GTM czas na przetworzenie consent update zanim odpali tagi
        setTimeout(function () {
            dataLayer.push({
                'event': 'consent_ready',
                'consent_analytics': analyticsStatus,
                'consent_marketing': marketingStatus
            });
        }, 0);
    },

    onChange: function ({ cookie, changedCategories }) {
        var analyticsStatus = cookie.categories.includes('analytics') ? 'granted' : 'denied';
        var marketingStatus = cookie.categories.includes('marketing') ? 'granted' : 'denied';
        gtag('consent', 'update', {
            'analytics_storage': analyticsStatus,
            'ad_storage': marketingStatus,
            'ad_user_data': marketingStatus,
            'ad_personalization': marketingStatus
        });
        // setTimeout 500 — dłuższe opóźnienie przy zmianie, GTM musi przetworzyć nowy consent
        setTimeout(function () {
            dataLayer.push({
                'event': 'consent_update',
                'consent_analytics': analyticsStatus,
                'consent_marketing': marketingStatus
            });
        }, 500);

        // Fizyczne usuwanie cookies przy cofnięciu zgody
        // (gtag denied blokuje nowe, ale nie usuwa już ustawionych)
        if (changedCategories.includes('analytics') && analyticsStatus === 'denied') {
            document.cookie.split(';').forEach(function (c) {
                var name = c.trim().split('=')[0];
                if (name.startsWith('_ga') || name.startsWith('_gid')) {
                    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' +
                        window.location.hostname.replace('www.', '') + ';';
                }
            });
        }
        if (changedCategories.includes('marketing') && marketingStatus === 'denied') {
            document.cookie.split(';').forEach(function (c) {
                var name = c.trim().split('=')[0];
                if (name.startsWith('_fbp') || name.startsWith('_gcl')) {
                    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' +
                        window.location.hostname.replace('www.', '') + ';';
                }
            });
        }
    }
});
