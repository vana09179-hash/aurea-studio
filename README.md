# Aurea Studio

[![Tests](https://github.com/vana09179-hash/aurea-studio/actions/workflows/test.yml/badge.svg)](https://github.com/vana09179-hash/aurea-studio/actions/workflows/test.yml)
[![Build](https://github.com/vana09179-hash/aurea-studio/actions/workflows/build.yml/badge.svg)](https://github.com/vana09179-hash/aurea-studio/actions/workflows/build.yml)
[![Release](https://img.shields.io/github/v/release/vana09179-hash/aurea-studio)](https://github.com/vana09179-hash/aurea-studio/releases/latest)

Безкоштовний редактор анімованих презентацій для Windows, Linux і macOS: morph-переходи, 40 анімацій, таблиці й діаграми (Sankey, Gantt, Waterfall), компоненти, автомакет, 40 шрифтів з кирилицею, експорт у PDF, HTML і .pptx.

- **Сайт:** https://vana09179-hash.github.io/aurea-studio/
- **Завантажити:** [Releases](https://github.com/vana09179-hash/aurea-studio/releases/latest)
- **Що нового:** [CHANGELOG.md](CHANGELOG.md)

## Експорт у PowerPoint

Файл .pptx — це не картинки, а редаговані об’єкти: текст, фігури, таблиці, діаграми, нотатки.

| Що | Як переноситься |
|---|---|
| Morph | Справжній перехід «Морфінг» (PowerPoint 2019 / 365); у старіших версіях — затухання |
| Анімації появи | Найближчі стандартні ефекти: виринання, масштаб, виліт, поява смугами, по словах і по буквах |
| Лічильники, shine, живі фони, конфеті | Не переносяться — для них є експорт у HTML, де працює все |
| Шрифти | Треба встановити на комп’ютері, де відкривають файл; після експорту програма показує їх список |

Кожен push перевіряється автоматично: тест проходить усі сценарії редактора, експортує .pptx і відкриває його в LibreOffice (`.github/workflows/test.yml`).

## Надійність

- Кожна зміна за секунду потрапляє в автозбереження.
- Якщо програма аварійно закриється, вона сама перезапуститься й відкриє роботу з автозбереження.
- Історія версій кожні 2 хвилини (Ctrl+Alt+H).

## Відомі обмеження

- Програма на Electron, тому інсталятор важить ~90 МБ, а сама програма займає ~300–450 МБ оперативної пам’яті.
- Збірки не підписані платним сертифікатом: Windows показує SmartScreen («Докладніше» → «Виконати все одно»), macOS — «невідомий розробник» (правою кнопкою → «Відкрити»). Версії для macOS мають ad-hoc підпис, тому не позначаються як «пошкоджені».

## Збірка й тести

```bash
npm ci
npm start                                   # запустити з вихідного коду
npx electron . --shots=out --skip=40,41,42  # прогнати всі сценарії й зберегти скріншоти
python tools/check-run.py out               # перевірити помилки й експортовані файли
npx electron-builder --win portable         # Windows
```

macOS і Linux збирає GitHub Actions (`.github/workflows/build.yml`) при кожному тезі `v*`.

Сайт лежить у `site/` і публікується на GitHub Pages (`.github/workflows/pages.yml`).

## Участь

Помилки й ідеї — у [Issues](https://github.com/vana09179-hash/aurea-studio/issues). Як надіслати зміни — [CONTRIBUTING.md](CONTRIBUTING.md).

## Ліцензія

MIT — див. `LICENSE.txt`.
