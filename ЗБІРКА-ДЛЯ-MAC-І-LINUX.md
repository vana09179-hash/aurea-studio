# Aurea Studio на Windows, Linux і macOS

## Готове на цьому комп'ютері
- **Windows:** `dist/AureaStudio-1.0.0-portable.exe` — подвійний клік.
- **Linux / Chromebook:** `dist/AureaStudio-1.0.0-linux-x64.tar.gz`
  1. `tar -xzf AureaStudio-1.0.0-linux-x64.tar.gz`
  2. `./AureaStudio-1.0.0-linux-x64/run.sh`
  3. За бажанням додати в меню: `./AureaStudio-1.0.0-linux-x64/install.sh`
  На Chromebook спершу увімкніть Linux: Налаштування → Розробники → «Середовище розробки Linux».

## macOS і AppImage — через GitHub (безкоштовно)
Програму для Mac можна зібрати лише на Mac, тому збирає GitHub:
1. Створіть репозиторій на github.com і завантажте туди цю папку (без `node_modules` і `dist` — їх відсіє `.gitignore`).
2. Вкладка **Actions** → «Build Aurea Studio» → **Run workflow**.
3. Приблизно через 10 хвилин унизу сторінки запуску з'являться файли:
   - `AureaStudio-Windows` — `.exe`
   - `AureaStudio-macOS` — `.dmg` для Intel і Apple Silicon (M1/M2/M3…)
   - `AureaStudio-Linux` — `.AppImage` і `.tar.gz`

### Перший запуск на Mac
Програма не підписана сертифікатом Apple, тому macOS спершу її заблокує:
- клацніть по програмі **правою кнопкою → «Відкрити» → «Відкрити»**, або
- у Терміналі: `xattr -dr com.apple.quarantine "/Applications/Aurea Studio.app"`
