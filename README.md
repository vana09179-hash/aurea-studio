# Aurea Studio

Безкоштовний редактор анімованих презентацій для Windows, Linux і macOS: morph-переходи, 37 анімацій, 12 шаблонів, 40 шрифтів з кирилицею, експорт у PDF, HTML і формат .pptx.

- **Сайт:** https://vana09179-hash.github.io/aurea-studio/
- **Завантажити:** розділ [Releases](https://github.com/vana09179-hash/aurea-studio/releases)

## Збірка

```bash
npm ci
npx electron-builder --win portable     # Windows
npx electron-builder --linux tar.gz     # Linux
```

Версію для macOS і AppImage збирає GitHub Actions (`.github/workflows/build.yml`), див. `ЗБІРКА-ДЛЯ-MAC-І-LINUX.md`.

Сайт лежить у `site/` і публікується на GitHub Pages workflow-ом `.github/workflows/pages.yml`.

## Ліцензія

MIT — див. `LICENSE.txt`.
