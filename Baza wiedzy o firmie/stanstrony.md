# AKTUALNY STAN STRONY — INWENTARZ IMPLEMENTACJI

_Ostatnia aktualizacja: kwiecień 2026_

## Status podstron

| Podstrona | Plik | Status | Uwagi |
|---|---|---|---|
| Strona główna | `index.html` | ✅ Zbudowana | Pełny lejek TOFU→BOFU |
| Automatyzacje | `automatyzacje.html` | ✅ Zbudowana | Sekcje: hero, challenges, solutions (3 tabs), use-cases, process, FAQ |
| Aplikacje | `aplikacje.html` | ✅ Zbudowana | Sekcje: hero, challenges, solutions, safety, process, form, FAQ |
| Agenci AI | `agenci.html` | 🔶 Szkielet | Tylko hero + form, wymaga rozbudowy |
| Biblioteka procesów | `rozwiazania.html` | 🔶 Placeholder | 3 karty wideo bez realnego contentu/wideo |
| Model pracy | `model-pracy.html` | ✅ Zbudowana | PoC + 6 gwarancji |
| Konsultacja | `konsultacja.html` | 🔶 Placeholder | Cal.com embed to SVG mockup, NIE działa rezerwacja |

## Sekcje z placeholderami (do zastąpienia realnym contentem)

### `konsultacja.html` — CAL.COM (KRYTYCZNE)
Widget rezerwacji to SVG-makieta. Należy zastąpić realnym embed kodem z Cal.com.
- Dokumentacja: https://cal.com/docs/embed/inline
- Element do zastąpienia: `<div class="booking-calendar">` (zawiera SVG z ikoną kalendarza)

### `rozwiazania.html` — Wideo procesów (WAŻNE)
3 karty z placeholderami SVG zamiast nagrań Loom/wideo. Strategia wymaga wideo w formacie "manualnie vs automat".
- Docelowe formaty: nagrania screen, podzielony ekran, konkretne liczby przy każdym
- Do dodania: onboarding klienta, obieg faktur, smart generator ofert

### `index.html` — Portfolio teaser (WAŻNE)
3 karty z SVG play-button zamiast realnych wideo. Te same nagrania co w rozwiazania.html.

## Sekcje wymagające rozbudowy

### `agenci.html`
Tylko hero z animacją SVG + formularz. Brak:
- Sekcji challenges (jakie problemy rozwiązują agenci)
- Konkretnych przypadków użycia (Agent obsługujący zapytania, Agent do analizy dokumentów)
- FAQ specyficznego dla AI Agents (bezpieczeństwo, limity, integracje)

## Co działa poprawnie

- Navbar i footer ładowane dynamicznie (globalnie edytowalne przez 1 plik)
- Animacje Intersection Observer (data-animate="fade-up" etc.)
- Typewriter na hero strony głównej
- ROI Calculator (3 suwaki, wyniki w PLN, format polski)
- Solutions tabs (przełączanie zakładek na index, automatyzacje, aplikacje)
- FAQ accordion (one-open, aria-expanded zarządzane przez JS)
- Mobile hamburger menu (z close-on-outside-click)
- Honeypot bot-protection na formularzu kontaktowym
- prefers-reduced-motion obsługiwane (CSS + JS)

## Nawigacja (navbar)

Aktualne linki w navbar:
- Automatyzacje → `/automatyzacje.html`
- Aplikacje → `/aplikacje.html`
- Biblioteka → `/rozwiazania.html`
- Model pracy → `/model-pracy.html`
- Konsultacja (CTA) → `/konsultacja.html`

_Agenci AI NIE ma linka w navbar — strona istnieje ale nie jest promowana przez nawigację._

## Wymagania zanim strona idzie na produkcję

1. **Cal.com embed** — bez tego lejek nie działa
2. **Wideo w bibliotece procesów** — główny element social proof wg strategii
3. **SEO** — brak: canonical URLs, Open Graph meta, Schema.org, sitemap.xml, robots.txt
4. **Form backend** — formularz kontaktowy nie ma `action=` ani JS handler; wymaga Formspree / EmailJS
