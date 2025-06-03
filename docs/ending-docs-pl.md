# Dokumentacja końcowa

## Dane statystyczne

### Ilość lini kodu -
### Liczba testów -
### Procentowe pokrycie kodu testami


## Spędzony czas


| **Zadanie** | **Czas (szac.)** | **Czas końcowo**|
|---|---|---|
| **Analiza i przygotowanie projektu** | **10h** | **10h** 
| Wybór stosu technologicznego, plan funkcjonalności | 3h | 3h
| Dokumentacja, podział ról, repozytorium, plan pracy | 7h | 7h
| Wstępne zamodelowanie wyglądu dokumentowej bazy danych | 6h | 6h
| **Backend (Django + PyO3)** | **50h** | **60h**
| Autoryzacja (JWT + OAuth2), obsługa sesji | 6h | 10h
| Obsługa plików CSV i walidacja | 6h | 6h
| API REST: uploady, sesje, interfejs do edycji | 12h | 18h
| Integracja z Rust (PyO3) i komunikacja z modułem ML | 10h | 10h
| Integracja z MongoDB, zamodelowanie bazy | 6h | 12h
| Integracja z Redis, cache'owanie tłumaczeń (i być może modeli) | 6h | **X**
| Testy jednostkowe zaimplementowanie przy pomocy Django test cases | 10h | 10h
| **Moduł tłumaczący (Rust + MarianMT)** | **30h** |
| Wczytywanie i optymalizacja modelu MarianMT | 6h |
| Mechanizm cache'owania + optymalizacje | 8h |
| Testowanie i integracja z backendem (PyO3) | 10h |
| **Frontend (React + Next.js + Tailwind)** | **80h** |
| Strona główna oraz okna do uwierzytelniania użytkownika | 10h |
| System uploadu i parser CSV (z wyborem kolumn/wierszy) | 16h |
| Interfejs do edycji tłumaczeń (z shortcutami, walidacją) | 24h |
| Widok sesji, tłumaczeń, edycja w oknie dialogowym | 10h |
| Eksport wyników, statusy tłumaczeń, widok postępu | 10h |
| Autoryzacja, routing, dostęp do API | 16h |
| Stylowanie i UX (Tailwind + shadcn/ui), responsywność | 10h |
| Integracja z backendem | 10h | 10h
| **DevOPS (opcjonalnie jeśli starczy czasu)** | **18h** |
| Skonteneryzowanie aplikacji za pomocą dockera | 6h |
| Ustawienie pipeline'ów CI/CD na Gitlabie | 6h | **X**
| Przepisanie Gitlabowego CI/CD na Github Actions | 6h | 

**Łączny czas projektu (bez DevOps): 170h**
**Łączny czas projektu (z DevOps): 188h**

## Napotkanie problemy

1. **Frontend:**
2. **Model:**
3. **Backend**:
        - Integracja MongoDB z django. Z jednej strony sam fakt użycia mongoDB oceniam pozytywnie, ale muszę przyznać, że jak chodzi o połączenie z django nie był aż tak trafny i można to traktować jako eskperymentalną próbę zapoznania się z tą bazą danych. Błędem był mały research co do zapoznania się jakie bazy danych współpracują z django jakie nie i niestety mongoDB do nich jak na razie nie należy. Głównym powodem wybrania go była możliwość przechowywania danych jako JSON, co ułatwia prace z nimi i przeszukiwanie a można by to równie dobrze zaimplementować przez np. SQL i użycie w django models.JSONField(). Można by powiedziec, że za to mongoDB daje lepszy performance, ale po (właśnie zapomnianym) researchu i doczytaniu wychodzi na to, że i tego nie daję, ze względu na trudności z transakcjami, co na szczęście przy prostej bazie danych i małej ilości potencjalnych zmian nie wpłyneło na całość, ale przy bardziej rozwiniętej bazie i większej możliwości zmieniania jej mogło by się nim stać, żeby dokonywać ich bezpiecznie i szybko. Wnioski: większy research co do współpracy różnych środowisk i łączenia ich.
4. **DevOps**:
