# **BAZA WIEDZY O FIRMIE: PROFIL DZIAŁALNOŚCI I OFERTA**

---

## CZĘŚĆ I — KIM JESTEŚMY I Z KIM PRACUJEMY

---

### **1\. Istota działalności (Kim jesteśmy)**

Jesteśmy butikowym software house'em (obecnie w modelu jednoosobowej działalności gospodarczej / solopreneur), specjalizującym się w automatyzacji procesów biznesowych oraz budowie dedykowanych aplikacji webowych i agentów AI. Działamy jako zwinna, inżynieryjna alternatywa dla dużych agencji IT. Rozwiązujemy problemy firm, które rosną szybciej, niż pozwalają na to ich obecne, manualne procesy.

Nie jesteśmy "kombinatem technologicznym" od wszystkiego. Nie budujemy stron wizytówkowych, sklepów e-commerce ani wielkich systemów ERP. Skupiamy się na chirurgicznych wdrożeniach, które dają mierzalny zwrot z inwestycji (ROI).

**Trzy filary oferty:**
1. **Automatyzacje procesów biznesowych** (n8n) — łączenie systemów i usuwanie ręcznej pracy
2. **Dedykowane aplikacje webowe** — mikronarzędzia zastępujące pękające w szwach Excele i niedopasowany SaaS
3. **Agenci AI** — autonomiczne systemy AI działające w imieniu firmy (analiza danych, obsługa zapytań, wsparcie decyzji)

---

### **2\. Profil Idealnego Klienta (ICP — Ideal Customer Profile)**

Celujemy w ściśle określony segment rynku (MŚP), co pozwala na utrzymanie wysokiej efektywności wdrożeń bez narzutu biurokratycznego.

* **Wielkość firmy:** 5 do 35 pracowników
* **Staż na rynku:** Powyżej 12 miesięcy
* **Faza biznesowa:** Firma zderza się z "bólem wzrostu". Liczba zamówień/klientów/danych rośnie, ale firma próbuje to obsługiwać starymi metodami (przeklejanie danych, pliki Excel, wymiana e-maili)
* **Decydent:** CEO, Właściciel, Dyrektor Operacyjny. Osoba nietechniczna, która rozumie liczby i procesy, ale nie interesuje jej kod
* **Zarządzanie:** Szybka ścieżka decyzyjna (brak wieloosobowych zarządów i skomplikowanych procedur zakupowych)

**Sygnały gotowości zakupowej (triggery):**
- "Mamy Excela, który obrasta, i nikt nie wie, jak go naprawić"
- "Każdy nowy pracownik to 2 tygodnie nauki zanim ruszy"
- "Dane z CRM nie trafiają do fakturowania — przeklejamy ręcznie"
- "Mamy 3 różne narzędzia i żadne nie gada z drugim"
- "Pracownicy spędzają kilka godzin dziennie na kopiowaniu tych samych informacji"
- "Już próbowaliśmy gotowego SaaS, ale nie pasuje do naszego procesu"
- "Nie mamy czasu na kolejny projekt IT — ostatni wdrożono pół roku, nic nie działa"

---

### **3\. Anty-Klient (Z kim świadomie NIE pracujemy)**

* **Korporacje i duże przedsiębiorstwa (35+ pracowników):** Wymagają wielopoziomowych audytów, przetargów, rozbudowanych działów UX/UI i certyfikacji. Obsługa takich podmiotów przez jednoosobowy software house to niepotrzebne ryzyko operacyjne i zamrożenie zasobów.
* **Mikrofirmy i startupy (1-4 osoby):** Zbyt mało powtarzalnych procesów, by automatyzacja miała uzasadnienie ekonomiczne. Zbyt wczesny etap, by wdrażać dedykowany soft.
* **Firmy szukające "taniej strony internetowej" lub sklepu e-commerce:** Poza zakresem działalności.
* **Firmy bez jasnego, powtarzalnego procesu:** Automatyzacja chaosu daje zautomatyzowany chaos. Wymagamy, by klient potrafił opisać swój proces krok po kroku.

---

## CZĘŚĆ II — SZCZEGÓŁOWY ZAKRES USŁUG

---

### **4A. Automatyzacje procesów biznesowych (n8n)**

**Co to jest:**
Projektowanie, budowa i utrzymanie przepływów automatyzujących powtarzalne procesy — bez pisania nowego oprogramowania od zera. Łączymy istniejące narzędzia firmy (CRM, ERP, e-mail, komunikatory, arkusze, systemy magazynowe) tak, żeby dane przepływały automatycznie tam, gdzie powinny.

**Narzędzie bazowe:** n8n — otwarty silnik do automatyzacji procesów (source-available), hostowany na serwerach klienta lub w chmurze EU. Obsługuje własny kod JavaScript/TypeScript, co odróżnia go od zabawek no-code (Zapier, Make) — skaluje się do milionów operacji miesięcznie.

**Typowe przykłady wdrożeń:**

| Obszar | Przykład automatyzacji | Efekt |
|---|---|---|
| Sprzedaż i CRM | Nowy lead z formularza → CRM → task w Notion → powiadomienie na Slack | 0 ręcznego przepisywania, 0 zagubionych leadów |
| Fakturowanie | Zaakceptowana oferta → automatyczna faktura → wysyłka do klienta → zapis w arkuszu | Z 15 min do 30 sekund na fakturę |
| Onboarding pracownika | Nowy wpis w HR → konta w systemach → e-mail powitalny → lista zadań | Standaryzacja procesu, 0 zapomnianych kroków |
| Komunikacja | Statusy zamówień z systemu → SMS/e-mail → klient | Obsługa bez angażowania pracownika |
| Dokumenty | Formularz → wypełnienie szablonu PDF → zapis w Drive → powiadomienie | Eliminacja copy-paste |
| Magazyn/Produkcja | Niski stan w ERP → alert → automatyczny wniosek o zamówienie | 0 przestojów z powodu braku materiałów |
| Analityka | Dane z wielu systemów → raport tygodniowy → e-mail do zarządu | Raporty bez godzin zbierania danych |
| Obsługa błędów | Każda awaria automatyzacji → log → alert na Slack + kolejka ponowień | Dane się nie gubią, IT reaguje natychmiast |

**Zaplecze techniczne (do wewnętrznego użytku, nie używać na stronie):**
- n8n (self-hosted lub cloud)
- REST API, webhooks, OAuth2
- JavaScript/TypeScript w nodach kodu
- Integracje z: HubSpot, Pipedrive, Basecamp, Notion, Airtable, Google Workspace, Microsoft 365, Slack, Trello, WooCommerce, Fakturownia, Subiekt, i dziesiątkami innych przez API

---

### **4B. Dedykowane aplikacje webowe**

**Co to jest:**
Budowa lekkich, celowanych aplikacji webowych (paneli, systemów, mikronarzędzi) dopasowanych dokładnie do procesu konkretnej firmy. Nie są to strony internetowe — to wewnętrzne narzędzia operacyjne.

**Kiedy klient tego potrzebuje:**
- Excel "pęka w szwach" — kilkusetstronicowe pliki, formuły na formułach, problemy z wersjonowaniem
- Gotowy SaaS jest za drogi, za skomplikowany lub nie obsługuje specyfiki branży
- Firma potrzebuje systemu, który połączy dane z kilku miejsc w jednym widoku
- Potrzeba generowania ofert/dokumentów/raportów wg własnego szablonu
- Firma chce coś "swojego" — nie uzależniać się od dostawcy

**Typowe przykłady wdrożeń:**

| Typ aplikacji | Opis | Zastępuje |
|---|---|---|
| System zamówień / ofertowania | Klient wybiera parametry → system liczy wycenę → PDF oferty generowany automatycznie | Excel + Word + ręczne wysyłanie |
| Panel operacyjny | Centralny widok zamówień, statusów, zasobów — dane z kilku systemów w jednym miejscu | Kilka otwartych zakładek + arkusze |
| System śledzenia projektów / zleceń | Statusy zleceń, przypisania, terminy, historia zmian | Excel współdzielony przez firmę |
| Baza wiedzy / dokumentacja wewnętrzna | Ustrukturyzowane dane produktowe, procedury, instrukcje | Pliki Word, PDF, maile |
| Kalkulator wycen / konfigurator | Parametryczny kalkulator cen dostosowany do specyfiki branży | Arkusz z ukrytymi formułami |
| LogicMorrow OS (pełny system) | Kompletna platforma operacyjna łącząca CRM, zamówienia, faktury, magazyn | Kilka różnych SaaS bez integracji |

**Stack techniczny (do wewnętrznego użytku):**
- Frontend: HTML, CSS, JavaScript (vanilla lub React w większych projektach)
- Backend: Node.js / TypeScript
- Bazy danych: PostgreSQL, SQLite
- Hosting: serwery klienta (on-premise) lub VPS w EU
- Standard rynkowy, open source — żaden vendor lock-in

---

### **4C. Agenci AI**

**Co to jest:**
Autonomiczne systemy sztucznej inteligencji, które działają w imieniu firmy — analizują dane, prowadzą rozmowy, podejmują decyzje w ramach zdefiniowanych reguł, piszą treści, klasyfikują dokumenty. Nie są to chatboty ze skryptami — to inteligentni asystenci podłączeni do danych firmy.

**Trzy profile agentów:**

**Agent Analityk:**
- Analizuje dane wewnętrzne (raporty, tabele, dane z CRM/ERP)
- Odpowiada na pytania w języku naturalnym: "Które produkty sprzedały się najgorzej w Q1?"
- Generuje raporty i podsumowania na żądanie
- Zastępuje godziny ręcznego przeglądania arkuszy

**Agent Operacyjny:**
- Obsługuje zapytania klientów / pracowników bez angażowania człowieka
- Klasyfikuje i routuje wiadomości (e-mail, chat, formularze)
- Automatycznie uzupełnia dane w systemach na podstawie dokumentów
- Pilnuje terminów i przypomina o zadaniach

**Agent Ekspert:**
- Działa jako wewnętrzna baza wiedzy firmy
- Odpowiada na pytania w oparciu o dokumenty, procedury, historię firmy
- Asystuje pracownikom podczas obsługi klienta (podpowiada odpowiedzi)
- Generuje oferty, maile, dokumenty wg szablonów firmy

**Bezpieczeństwo danych w agentach AI:**
- Dane firmy nie trafiają do trenowania modeli AI zewnętrznych dostawców
- Możliwość wdrożenia w pełni lokalnie (prywatne modele LLM)
- Każde działanie agenta jest logowane i audytowalne

---

## CZĘŚĆ III — MODEL WSPÓŁPRACY I GWARANCJE

---

### **5\. Model Proof of Concept (PoC) — jak zaczynamy**

**Dlaczego PoC, nie projekt na pół roku:**
Nie sprzedajemy wielomiesięcznych projektów z góry. Pracujemy w modelu Proof of Concept: bierzemy jeden konkretny proces klienta, wyceniamy go na stałą kwotę i dostarczamy w 2–3 tygodnie. Dopiero gdy klient widzi, że to działa na jego danych, decyduje, czy automatyzujemy kolejne obszary.

**4 etapy każdego projektu:**

1. **Bezpłatna konsultacja (20 min)** — analiza procesu, wyliczenie ROI, decyzja czy wdrożenie ma sens ekonomicznie. Jeśli matematyka nie wskazuje zwrotu w <6 miesięcy, odradzamy projekt.
2. **Analiza i specyfikacja** — dokładne mapowanie procesu, wybór narzędzi, stała wycena (brak niespodziankowych faktur)
3. **Budowa i testy równoległe (Shadow Run)** — system działa równolegle do pracy zespołu. Przełączamy wajchę dopiero gdy mamy 100% pewności poprawności działania
4. **Wdrożenie i przekazanie** — szkolenie, dokumentacja, przekazanie pełnego dostępu. Brak abonamentów za "fakt istnienia systemu"

---

### **6\. Sześć gwarancji (model-pracy)**

1. **Własność kodu** — po zakończeniu projektu klient dostaje pełny kod, repozytorium i dokumentację. Może zlecić rozbudowę komukolwiek innemu.
2. **Stała cena** — wycena przed projektem to kwota końcowa. Bez "scope creep" i "dodatkowych godzin.
3. **Brak vendor lock-in** — buduję na otwartych standardach. Żadna platforma subskrypcyjna nie może zablokować klienta ani podnieść cen.
4. **Jeden kontakt** — klient rozmawia bezpośrednio z inżynierem, który projektuje i wdraża. Zero głuchego telefonu przez handlowca i PM.
5. **Shadow Run** — nigdy nie wyłączamy starych procesów z dnia na dzień. Nowe rozwiązanie pracuje równolegle, dopóki nie ma 100% pewności.
6. **Dane u klienta** — system i dane mogą być hostowane na serwerach klienta lub na dedykowanym serwerze w UE. RODO spełnione by design.

---

### **7\. Filozofia pracy i pozycjonowanie rynkowe**

* **Płaska struktura (One-point of contact):** Klient rozmawia bezpośrednio z inżynierem, który projektuje rozwiązanie i fizycznie je wdraża. Brak głuchego telefonu na linii "Handlowiec → Project Manager → Programista"
* **Lean / Agile:** Minimalizujemy formalności. Zamiast wielomiesięcznych audytów typowych dla dużych agencji, stawiamy na szybkie prototypowanie (PoC) i szybkie dowożenie wartości
* **Transparentność:** Udostępniamy klientom pełną architekturę i kod rozwiązań. Nie stosujemy vendor lock-in
* **Chłodna ocena ROI:** Jeśli projekt nie ma matematycznego uzasadnienia, odradzamy go wprost. Lojalność budujemy przez szczerość, nie przez wciskanie projektów

---

## CZĘŚĆ IV — KOMUNIKACJA I MARKETING

---

### **8\. Język i komunikacja (Tone of Voice)**

* **Zero technologicznego żargonu w komunikacji zewnętrznej:** Nie mówimy o "optymalizacji zapytań API", "węzłach w n8n" czy "stacku technologicznym"
* **Język biznesu i liczb:** Komunikacja opiera się na: uwolnione roboczogodziny, redukcja błędów ludzkich, minimalizacja kosztów operacyjnych, szybki ROI
* **Realizm i chłodna ocena:** Odcinamy się od "hype'u" na AI. Oferujemy rzemiosło, logikę i stabilność
* **Bezpośredniość:** Piszemy tak, jak mówimy. Bez korporacyjnej nowomowy

**Zakaz żargonu IT w tekstach dla klientów:**

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

---

### **9\. Kluczowe komunikaty marketingowe (copy pillarsy)**

**Pillar 1 — Oszczędność czasu (TOFU)**
> "Twój zespół spędza X godzin tygodniowo na kopiowaniu danych między systemami. To [X × stawka] zł miesięcznie za pracę, którą maszyna może robić w 3 sekundy."

**Pillar 2 — Eliminacja błędów (TOFU/MOFU)**
> "Każde ręczne przepisywanie to ryzyko błędu. Automatyzacja wykonuje ten sam proces 1000 razy z identycznym wynikiem."

**Pillar 3 — Bezpieczeństwo i kontrola (MOFU)**
> "Twój kod, Twoje dane, Twoje serwery. Po projekcie nie płacisz abonamentu za sam fakt, że system istnieje."

**Pillar 4 — Szybkość i minimalne ryzyko (MOFU)**
> "Nie prosimy o 3-miesięczny kontrakt z góry. Zaczynamy od jednego procesu, w 2–3 tygodnie. Jeśli nie działa — tracisz tylko koszt jednego mikrowdrożenia."

**Pillar 5 — Butikowa jakość (BOFU)**
> "Rozmawiasz bezpośrednio z inżynierem, który to zbuduje. Nie z handlowcem, który przekaże to PM-owi, który przekaże to juniorowi."

---

### **10\. Zbijanie głównych obiekcji**

| Obiekcja | Odpowiedź |
|---|---|
| "Jesteś za mało znany / brak portfolio" | "Mój kod jest otwarty — możesz zlecić audyt niezależnemu programiście przed podpisaniem umowy." |
| "Co jeśli znikniesz w połowie projektu?" | "Model PoC — zaczynamy od małego wycinka. Twoje ryzyko = koszt jednego mikrowdrożenia." |
| "n8n to zabawka, nie Enterprise" | "n8n skaluje się do milionów operacji miesięcznie i obsługuje własny kod JS/TS. Nie jest to Zapier." |
| "RODO — gdzie będą moje dane?" | "System stoi na Twoich serwerach lub dedykowanym VPS w UE. Dane nie opuszczają Twojej jurysdykcji." |
| "Pracownicy tego nie ogarną" | "Shadow Run — nowe rozwiązanie pracuje równolegle, przełączamy wajchę dopiero po 100% weryfikacji." |
| "Jak coś padnie w weekendy?" | "Error handling + monitoring + Slack alert z logiem błędu. Dane trafiają do kolejki, nie giną." |
| "Nie wiem ile to kosztuje" | "Nie wiesz, bo nie policzyłeś kosztu obecnego procesu. Robimy to razem na bezpłatnej konsultacji." |
| "Skąd wiem, że się zwróci?" | "Liczymy Twój ROI na konsultacji. Jeśli zwrot >6 miesięcy — odradzamy projekt wprost." |

---

### **11\. Kontekst branżowy (Background)**

Firma posiada silne zaplecze i doświadczenie operacyjne w **branżach przemysłowych**. Znamy specyfikę pracy, język i problemy zakładów produkcyjnych, logistyki i utrzymania ruchu. Mimo powszechnego oporu przed IT w tym sektorze, potrafimy tam skutecznie wdrażać rozwiązania.

*Ważne:* Doświadczenie przemysłowe jest silnym atutem i uwiarygodnieniem biznesowym (umiejętność pracy z "ciężkim" biznesem), ale **nie jest ograniczeniem**. Oferta jest uniwersalna i skierowana do wszystkich firm w segmencie 5–35 pracowników, niezależnie od branży.

**Branże z naturalnym dopasowaniem do oferty:**
- Produkcja i przemysł (obsługa zleceń, dokumentacja, stany magazynowe)
- Usługi B2B (obieg dokumentów, onboarding klientów, raportowanie)
- Handel (integracje e-commerce + ERP + logistyka)
- Budownictwo i instalatorzy (wyceny, harmonogramy, rozliczenia)
- Logistyka i transport (śledzenie zleceń, dokumenty przewozowe)

---

### **12\. Pozycjonowanie konkurencyjne**

| Kryterium | Duże agencje IT | Narzędzia SaaS (Zapier, Make) | LogicMorrow |
|---|---|---|---|
| Czas wdrożenia | 3–12 miesięcy | Godziny–dni (ale ograniczone) | 2–3 tygodnie (PoC) |
| Dopasowanie do procesu | Wysokie (kosztuje) | Niskie (szablony) | Wysokie (na miarę) |
| Kontakt z wykonawcą | PM → Junior | Brak (samodzielnie) | Bezpośrednio z inżynierem |
| Vendor lock-in | Wysoki | Bardzo wysoki | Zero — kod własność klienta |
| Cena | Wysoka (stały zespół) | Niska start, rośnie z użyciem | Jednorazowa wycena |
| Skalowalność | Wysoka | Ograniczona limitem API | Wysoka (self-hosted n8n) |
| Własność kodu | Rzadko | Nie dotyczy | Zawsze |

---

## CZĘŚĆ V — IDENTYFIKACJA WIZUALNA

---

### **13\. Kolory główne**

| Nazwa | HEX | Zastosowanie |
|---|---|---|
| Niebieski główny | `#2563eb` | CTA, przyciski, akcenty, numery |
| Niebieski hover | `#1d4ed8` | Stany hover, gradienty |
| Niebieski jasny | `#3b82f6` | Wartości w kartach, wyróżnienia |
| Slate ciemny | `#0f172a` | Tła nagłówków, ciemne sekcje, główny tekst na ciemnym tle |
| Slate 800 | `#1e293b` | Alternatywne ciemne tła |
| Slate 700 | `#334155` | Tekst drugorzędny |
| Slate 500 | `#64748b` | Tekst pomocniczy, podpisy |
| Slate 300 | `#cbd5e1` | Linie, obramowania |
| Slate 200 | `#e2e8f0` | Subtelne linie, tła alternatywne |
| Slate 100 | `#f1f5f9` | Jasne tła elementów |
| Slate 50 | `#f8fafc` | Tło strony |
| Biały | `#ffffff` | Karty, tekst na ciemnym tle |

### **14\. Kolory akcentowe**

| Nazwa | HEX | Zastosowanie |
|---|---|---|
| Zielony sukces | `#10b981` | Checkmarki, komunikaty sukcesu, pozytywne wskaźniki |
| Amber akcent | `#f59e0b` | Ostrzeżenia, wyróżnienia, akcenty złote |
| Czerwony | `#ef4444` | Błędy, ostrzeżenia krytyczne |

### **15\. Niebieskie tła (jasne)**

| Nazwa | HEX | Zastosowanie |
|---|---|---|
| Blue-50 | `#eff6ff` | Jasne tła w calloutach, podświetlenia |
| Blue-100 | `#dbeafe` | Tagi, etykiety TOFU |

### **16\. Gradienty brandowe**

- **Cover/hero ciemny:** `linear-gradient(135deg, #0f172a 0%, #0c1f4a 60%, #1d4ed8 100%)`
- **Nagłówek sekcji:** `linear-gradient(90deg, #1d4ed8, #2563eb)`
- **TOFU (niebieski):** `linear-gradient(90deg, #1d4ed8, #2563eb)`
- **MOFU (zielony):** `linear-gradient(90deg, #065f46, #10b981)`
- **BOFU (czerwony):** `linear-gradient(90deg, #991b1b, #ef4444)`

### **17\. Styl grafik reklamowych**

- Tło główne: ciemne (`#0f172a`) lub białe (`#ffffff`)
- Kolor wiodący: niebieski `#2563eb`
- Zaokrąglenie krawędzi (border-radius): `10px`
- Cień: `0 2px 14px rgba(15,23,42,.10)`
- Styl ogólny: minimalistyczny, profesjonalny, B2B — bez ozdobników
- Numery i ikony: kółka z niebieskim tłem (`#2563eb`), biały tekst, font-weight 800
- Tekst na ciemnym tle: biały `#ffffff`
- Tekst na jasnym tle: slate-900 `#0f172a`

**Przykładowe kombinacje do grafik Meta Ads:**

*Wariant ciemny (rekomendowany):*
- Tło: `#0f172a`
- Nagłówek: biały `#ffffff`, Inter 700–800
- Akcent/wyróżnienie: `#2563eb` lub `#3b82f6`
- Tekst pomocniczy: `#64748b`

*Wariant jasny:*
- Tło: `#f8fafc` lub `#ffffff`
- Nagłówek: `#0f172a`, Inter 700–800
- Akcent: `#2563eb`
- Tekst pomocniczy: `#64748b`

### **18\. Typografia**

- Font: **Inter** (Google Fonts) główny
- Wagi: 300, 400, 500, 600, 700, 800, 900
- Styl: nowoczesny, bezszeryfowy, czytelny — profesjonalny B2B
- Import: `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap`

Font pomocniczy (techniczny/retro akcent):
`https://fonts.google.com/specimen/VT323`
