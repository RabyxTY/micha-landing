# Михаил Дьяконов — Персональный гид по Латинской Америке

Лендинг и CMS для персонального гида по Буэнос-Айресу и Рио-де-Жанейро.

## Функционал

- Современный лендинг с информацией об экскурсиях и турах
- Защищённая админ-панель (`/admin`) с авторизацией через Google
- Управление контентом через Firebase Firestore:
  - Экскурсии (Буэнос-Айрес, Рио-де-Жанейро)
  - Авторские туры (Аргентина, Бразилия, Перу)
  - Культурные заметки
- Мгновенное обновление контента на главной странице

## Настройка Firebase

1. Создайте проект в [Firebase Console](https://console.firebase.google.com/)

2. Включите Authentication → Sign-in method → Google

3. Создайте Firestore Database в production mode

4. Добавьте правила безопасности для Firestore:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Чтение разрешено всем
    match /{document=**} {
      allow read: if true;
    }
    
    // Запись только для авторизованного администратора
    match /excursions/{document=**} {
      allow write: if request.auth != null && 
        request.auth.token.email == 'your-admin-email@gmail.com';
    }
    match /tours/{document=**} {
      allow write: if request.auth != null && 
        request.auth.token.email == 'your-admin-email@gmail.com';
    }
    match /notes/{document=**} {
      allow write: if request.auth != null && 
        request.auth.token.email == 'your-admin-email@gmail.com';
    }
  }
}
```

5. Создайте файл `.env` на основе `.env.example`:
```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_ADMIN_EMAIL=your-admin-email@gmail.com
```

## Доступ к админ-панели

1. Откройте сайт
2. В футере кликните 5 раз по символу © в течение 2 секунд
3. Войдите через Google с email, указанным в `VITE_ADMIN_EMAIL`
4. Вы будете перенаправлены на `/admin`

## Загрузка фотографий

Для добавления фото к экскурсиям и турам используйте внешние сервисы:
- [Imgur](https://imgur.com/) — бесплатный хостинг изображений
- [Cloudinary](https://cloudinary.com/) — профессиональный хостинг (есть бесплатный план)
- [ImgBB](https://imgbb.com/) — простой и быстрый хостинг

Загрузите фото на один из сервисов и вставьте ссылку в поле "URL фото" в админ-панели.

## Разработка

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
npm run preview
```

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
