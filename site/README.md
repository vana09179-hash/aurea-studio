# Сайт Aurea Studio

Статичний сайт: `index.html`, `style.css`, `script.js`, `img/`, `fonts/`. Сервер не потрібен.

## Перегляд на своєму комп'ютері
Відкрийте `site/index.html` у браузері. Кнопки завантаження ведуть на файли в `../dist/`.

## Перед публікацією
У `script.js` вгорі змініть посилання `DOWNLOADS` на справжні адреси файлів (наприклад, GitHub Releases).

## Де розмістити безкоштовно
- **GitHub Pages:** workflow `.github/workflows/pages.yml` публікує теку `site/` (Settings → Pages → Source: GitHub Actions). Файли програми — у Releases.
- **Netlify:** перетягніть теку `site` на app.netlify.com/drop.
- **Cloudflare Pages:** підключіть репозиторій, тека збірки — `site`.
