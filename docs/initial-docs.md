# Narzędzie do półautomatycznego tłumaczenia zbiorów tekstu

**Kacper Górski (331379)**
**Szymon Kamiński (331387)**
---
## Opis projektu

Projekt polega na opracowaniu narzędzia wspomagającego **półautomatyczne tłumaczenie zbiorów tekstu** w formacie **.csv**.
Rozwiązanie zaimplementowane jest jako **aplikacja webowa** z **niskopoziomowym backendem** i **modułem ML** do tłumaczenia tekstu.

## Funkcjonalności

  **Obsługa plików:**
- Wczytywanie plików CSV (z możliwością rozbudowy do innych formatów)
- Wybór kolumn do tłumaczenia
- Wybór zakresu rzędów do przetłumaczenia

**Tłumaczenie:**
- Obsługa wielu języków wejściowych i jednego języka docelowego
- Rozpoznawanie języka tekstu
- Automatyczna propozycja tłumaczenia
- Edytowalne pole do korekty tłumaczenia przez użytkownika

**Interakcja użytkownika:**
- Obsługa skrótów klawiszowych
- Możliwość wznawiania procesu tłumaczenia po ponownym uruchomieniu aplikacji

**Eksport wyników:**
- Pobieranie pliku z przetłumaczonym tekstem

## Założenia technologiczne

Frontend zostanie napisany przy pomocy framework'a **React (Typescript)**.
Backend natomiast będzie stworzony w języku **Rust** przy pomocy biblioteki **Actix-Web** oraz **PyO3**,
aby zagnieździć Pythona w tym właśnie języku. Jeżeli chodzi o **Pythona**,
to właśnie komponent tłumaczeniowy będzie zrealizowany przy pomocy
**transformers z Hugging Face (MarianMT) oraz langdetect**.
Baza danych w której będziemy przechowywać dane użytkownika oraz informacje
potrzebne do wznowienia tłumaczenia przechowywać będziemy w
systemie zarządzania bazami danych **PostgreSQL**.

## Kosztorys czasu i podproblemów

| **Zadanie** | **Czas** |
| --- | --- |
| **Analiza, przygotowanie środowiska, dokumentacja wstępna** | ~6h |
| Napisanie dokumentacji wstępnej | 2h |
| Stworzenie wstępnych struktur projektu (repozytorium, struktura projektu) | 1h |
| Rozważania na temat stosowanych technologii oraz stylu pracy | 3h |
| **Backend** | ~50h |
| Autoryzacja tokenem JWT | 10h |
| Parsowanie plików CSV (z walidacją) | 4h |
| Przygotowanie endpointów do komunikacji z frontendem (REST API) | 12h |
| Integracja Rust <-> Python (PyO3) | 8h |
| Połączenie z PostgreSQL (przechowywanie progresu, użytkowników, stworzenie modelu bazy danych) | 8h |
| Optymalizacja przetwarzania danych | 8h |
| **Moduł tłumaczeniowy w Pythonie** | 12h |
| Rozpoznawanie języka wejściowego (langdetect) | 3h |
| Integracja modelu MarianMT (ładowanie modelu, tłumaczenie) | 4h |
| Obsługa kontekstu tłumaczenia i testy | 5h |
| **Frontend** | ~44h |
| Podstawowa struktura aplikacji i UI | 6h |
| Obsługa plików CSV (prezentacja, parsowanie, wybór kolumn/rzędów) | 8h |
| Integracja z backendem (fetch API, obsługa tłumaczeń) | 8h |
| Implementacja skrótów klawiszowych umożliwiających wygodniejsze korzystanie z aplikacji | 6h |
| Edycja tłumaczenia przez użytkownika | 8h |
| Eksport wyników w formacie CSV | 6h |

**Razem**: 44 + 12 + 50 + 6 == 112h

## Podsumowanie

Projekt pozwala na **efektywne zarządzanie procesem tłumaczenia zbiorów tekstu**, łącząc **wydajny backend w Rust** z **modułami ML w Pythonie**.
Implementacja zapewnia użytkownikowi **pełną kontrolę nad procesem tłumaczenia** oraz **możliwość edycji wyników**, co poprawia jakość translacji.
