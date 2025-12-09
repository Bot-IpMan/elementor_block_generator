# Elementor Block Generator

Elementor Block Generator — це fullstack застосунок для створення та експорту HTML/CSS блоків, готових до вставки у віджет *HTML* в Elementor або інші конструктори. Проєкт поєднує Express + tRPC бекенд із React/Vite фронтендом, щоб дати візуальний конфігуратор, попередній перегляд та генерацію мінімізованого коду.

## Що вміє
- **Візуальний конструктор**: налаштування кольорів, типографіки, відступів, ефектів і контенту у режимі реального часу. 【F:client/src/pages/Configurator.tsx†L18-L158】
- **Готові шаблони**: hero, pricing card, feature list, testimonial, CTA, team, service та кастомний варіант. 【F:client/src/pages/Configurator.tsx†L11-L40】
- **Генерація коду**: бекенд формує та мінімізує HTML/CSS під обраний шаблон. 【F:server/routers.ts†L73-L125】
- **Копіювання й завантаження**: швидке копіювання у буфер або скачування файлом із вбудованими стилями. 【F:client/src/pages/Configurator.tsx†L96-L136】
- **Збереження пресетів**: авторизовані користувачі можуть створювати, оновлювати, переглядати та видаляти конфігурації блоків у БД. 【F:server/routers.ts†L20-L71】

## Стек
- **Frontend**: Vite, React 19, Radix UI, Tailwind CSS, TanStack Query, wouter.
- **Backend**: Express, tRPC, Drizzle ORM (MySQL), esbuild.
- **Інше**: dotenv для конфігів, Vitest для тестів, pnpm як пакетний менеджер.

## Запуск на Windows
1. **Встановіть залежності**
   - Node.js 20+ (можна через [nvm-windows](https://github.com/coreybutler/nvm-windows)).
   - pnpm `npm install -g pnpm`.
   - MySQL (локально або у контейнері) — використовується Drizzle.

2. **Клон і підготовка**
   ```powershell
   git clone <repo-url>
   cd elementor_block_generator
   pnpm install
   ```

3. **Налаштуйте середовище**
   Створіть `.env` у корені та заповніть потрібні змінні (за потреби видаліть непотрібні):
   ```env
   NODE_ENV=development
   PORT=3000
   DATABASE_URL=mysql://user:password@localhost:3306/elementor_blocks
   JWT_SECRET=replace_me
   VITE_APP_ID=local
   OAUTH_SERVER_URL=http://localhost:3000/api/oauth
   OWNER_OPEN_ID=admin
   BUILT_IN_FORGE_API_URL=
   BUILT_IN_FORGE_API_KEY=
   ```
   Backend читає їх у `server/_core/env.ts`. 【F:server/_core/env.ts†L1-L10】

4. **Міграції БД (за потреби)**
   Якщо потрібна БД, задайте `DATABASE_URL` і виконайте:
   ```powershell
   pnpm db:push
   ```

5. **Режим розробки**
   ```powershell
   pnpm dev
   ```
   Сервер сам займе доступний порт, починаючи з 3000, піднявши Vite для фронтенду та tRPC API. 【F:server/_core/index.ts†L1-L51】

6. **Продакшн-білд**
   ```powershell
   pnpm build
   pnpm start
   ```
   `build` збирає фронтенд і бандлить бекенд, а `start` запускає готовий сервер. 【F:package.json†L7-L15】

7. **Збірка Windows .exe**
   Якщо потрібно віддати готовий виконуваний файл без встановлення Node.js і pnpm на машині користувача, виконайте на машині збірки:
   ```powershell
   pnpm package:win
   ```
   - Скрипт спершу збере фронтенд/бекенд, а потім упакує результат у `release/elementor-block-generator.exe`. 【F:package.json†L7-L34】
   - Покладіть поруч із `.exe` файл `.env` (якщо потрібна БД або кастомні токени) — змінні читаються з каталогу запуску.
   - Запуск подвійним кліком або через `PowerShell ./elementor-block-generator.exe`. Програма займе доступний порт, починаючи з 3000, і віддасть інтерфейс за `http://localhost:<порт>/`.

## Структура
- `client/` — React UI, сторінки домашня, конструктор, галерея компонентів. 【F:client/src/App.tsx†L1-L42】
- `server/` — Express + tRPC API, генерація блоків, маршрути OAuth. 【F:server/_core/index.ts†L1-L51】【F:server/routers.ts†L1-L125】
- `drizzle/` — схема БД та міграції.

## Швидкий сценарій використання
1. Запустіть `pnpm dev` і відкрийте `http://localhost:3000`.
2. На головній сторінці натисніть «Відкрити конструктор». 【F:client/src/pages/Home.tsx†L21-L69】
3. Оберіть шаблон, налаштуйте стилі та контент, скопіюйте або скачайте готовий HTML/CSS.

Готово — вставляйте код у віджет Elementor HTML або використовуйте в будь-якому іншому конструкторі.
