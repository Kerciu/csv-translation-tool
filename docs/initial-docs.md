# Narzędzie do półautomatycznego tłumaczenia zbiorów tekstu

**Kacper Górski (331379)**
**Szymon Kamiński (331387)**
---
## Opis projektu

Projekt polega na opracowaniu narzędzia wspomagającego **półautomatyczne tłumaczenie zbiorów tekstu** w formacie **.csv**.
Rozwiązanie zaimplementowane jest jako **full-stack'owa aplikacja webowa** z **niskopoziomowym modułem ML** do tłumaczenia tekstu.

## Funkcjonalności

  **Obsługa plików:**
- Wczytywanie plików CSV (z możliwością rozbudowy do innych formatów)
- Parsowanie plików i wizualizacja danych
- Wybór kolumn do tłumaczenia
- Wybór zakresu rzędów do przetłumaczenia

**Tłumaczenie:**
- Wybór języka naturalnego początkowego oraz docelowego
- Automatyczna propozycja tłumaczenia
- Wyświetlone widocznie błędy wykryte podczas tłumaczenia
- Dialog pozwalający na przeprowadzenie korekt tłumaczenia przez użytkownika

**Interakcja użytkownika:**
- Uwierzytelnianie poprzez tokeny JWT oraz OAuth2
- Obsługa skrótów klawiszowych
- Możliwość wznawiania procesu tłumaczenia po ponownym uruchomieniu aplikacji (zapisywanie progresu w bazie danych)

**Eksport wyników:**
- Pobieranie pliku z przetłumaczonym tekstem

## Założenia technologiczne

Frontend został zaimplementowany przy użyciu frameworka **React (TypeScript)** wraz z **Next.js**. Do zapewnienia nowoczesnego wyglądu aplikacji użyto **Tailwind CSS** oraz biblioteki komponentów **shadcn/ui**.

Backend został zrealizowany w języku **Python** z wykorzystaniem frameworka **Django**. Odpowiada on za walidację danych, **REST API** oraz uwierzytelnianie użytkowników za pomocą **JWT i OAuth2**.

Moduł tłumaczeniowy bazuje na **transformerze MarianMT z biblioteki Hugging Face** i został zaimplementowany w języku **Rust**, aby zapewnić wysoką wydajność tłumaczeń, znacząco przewyższającą odpowiedniki w Pythonie. Do integracji tego modułu z backendem użyto **PyO3**.

Dane użytkowników oraz informacje niezbędne do wznowienia tłumaczeń przechowywane są w bazie **MongoDB**, wybranej ze względu na elastyczną strukturę danych.

Do cache’owania tłumaczeń (i potencjalnie modeli) wykorzystano **Redis**, co pozwala znacząco skrócić czas oczekiwania na wyniki.

W miarę dostępnego czasu planowane jest również:

- konteneryzowanie aplikacji z użyciem **Dockera**

- przygotowanie **pipeline’ów CI/CD**

## Kosztorys czasu i podproblemów

Dzięki, że dajesz znać! Skoro frontend zajął Ci około **80 godzin**, to zróbmy realistyczny kosztorys – taki, który:

- Odzwierciedla realny wkład czasowy,
- Uwzględnia złożoność poszczególnych komponentów,
- Jest spójny z tym, co faktycznie zostało zrobione.

Oto poprawiona wersja kosztorysu:

---

## 🔧 Kosztorys czasu i podproblemów

| **Zadanie** | **Czas (szac.)** |
|---|---|
| **Analiza i przygotowanie projektu** | **10h** |
| Wybór stosu technologicznego, plan funkcjonalności | 3h |
| Dokumentacja, podział ról, repozytorium, plan pracy | 7h |
| Wstępne zamodelowanie wyglądu dokumentowej bazy danych | 6h |
| **Backend (Django + PyO3)** | **50h** |
| Autoryzacja (JWT + OAuth2), obsługa sesji | 6h |
| Obsługa plików CSV i walidacja | 6h |
| API REST: uploady, sesje, interfejs do edycji | 12h |
| Integracja z Rust (PyO3) i komunikacja z modułem ML | 10h |
| Integracja z MongoDB, zamodelowanie bazy | 6h |
| Integracja z Redis, cache'owanie tłumaczeń (i być może modeli) | 6h |
| Testy jednostkowe zaimplementowanie przy pomocy Django test cases | 10h |
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
| **DevOPS (opcjonalnie jeśli starczy czasu)** | **18h** |
| Skonteneryzowanie aplikacji za pomocą dockera | 6h |
| Ustawienie pipeline'ów CI/CD na Gitlabie | 6h |
| Przepisanie Gitlabowego CI/CD na Github Actions | 6h |

**Łączny czas projektu (bez DevOps): 170h**
**Łączny czas projektu (z DevOps): 188h**

## Podsumowanie

Stworzone narzędzie umożliwia szybkie i półautomatyczne tłumaczenie zbiorów tekstów dzięki połączeniu nowoczesnych technologii: frontend w React/Next.js, wydajny backend w Django, oraz moduł ML w Rust z wykorzystaniem MarianMT.
Dzięki elastycznemu podejściu do danych (MongoDB + Redis), użytkownik może swobodnie pracować z dużymi plikami, edytować tłumaczenia i wznawiać sesję.
Projekt kładzie nacisk na ergonomię użytkownika, wydajność, oraz modularność, co czyni go solidnym rozwiązaniem do automatyzacji tłumaczeń w środowiskach produkcyjnych i badawczych.