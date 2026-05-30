# Książka Kucharska

Aplikacja webowa do zarządzania przepisami kulinarnymi. Pozwala przeglądać przepisy w podziale na kategorie, a także dodawać, edytować i usuwać własne przepisy po zalogowaniu.

Projekt używa:
- `Express` i `EJS` do serwowania stron i renderowania widoków
- `SQLite` jako prostą lokalną bazę danych
- `argon2` do bezpiecznego haszowania haseł
- sesji cookies do utrzymania zalogowanego użytkownika

## Funkcje

- rejestracja i logowanie użytkowników
- ochrona tras wymagających zalogowania
- lista kategorii przepisów
- przeglądanie szczegółów przepisu
- tworzenie nowego przepisu po zalogowaniu
- edycja i usuwanie przepisów przez właściciela lub administratora
- estetyczny, responsywny interfejs CSS

## Uruchomienie

1. Zainstaluj zależności i przygotuj środowisko:

```bash
npm run setup
```

2. Uruchom serwer:

```bash
npm start
```

3. Otwórz stronę w przeglądarce:

`http://localhost:8000`

## Testowe konto

- Login: `test`
- Hasło: `testpassword123`

## Struktura projektu

- `controllers/` — logika uwierzytelniania
- `models/` — dane przepisów, sesji oraz użytkowników
- `views/` — szablony EJS stron
- `public/css/` — stylizacja interfejsu
- `utils/` — pomocnicze skrypty do ustawień i bazy danych
