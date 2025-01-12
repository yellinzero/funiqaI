# Funiq AI Frontend

The frontend application for Funiq AI, built with Next.js and Material UI.

## 🛠 Tech Stack

- Next.js 15
- React 19
- Material UI v6
- TypeScript
- i18next
- React Query 5
- React Hook Form 7
- Zod 3
- Emotion

## 📋 Prerequisites

- Node.js 18+
- pnpm 9.12.2+

## 🚀 Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Configure environment:

```bash
cp .env.example .env
```

Required environment variables:
- `NEXT_PUBLIC_API_BASE`: Backend API URL (dev: http://127.0.0.1:5001)

3. Start development server:

```bash
pnpm dev
```

Visit http://localhost:3000 to view the application.

## 📝 Available Commands

- `pnpm dev`: Start development server (includes OpenAPI types generation)
- `pnpm build`: Build for production
- `pnpm start`: Start production server
- `pnpm lint`: Run code linting
- `pnpm lint:fix`: Fix linting issues
- `pnpm test`: Run tests with Vitest
- `pnpm generate:openapi`: Generate API types from OpenAPI spec

## 📁 Project Structure

```
frontend/
├── app/             # Next.js application pages
├── components/      # React components
├── hooks/          # Custom React hooks
├── theme/          # Theme configuration
├── plugins/        # Plugin configurations
├── public/         # Static assets
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── locales/        # i18n translation files
    ├── en/         # English translations
    └── zh-CN/      # Chinese translations
```

## 🔧 Development Tools

- ESLint with @antfu/eslint-config for code linting
- Vitest for unit testing
- Testing Library for React component testing
- Husky for git hooks
- Commitlint for commit message linting
- OpenAPI TypeScript for API type generation

## 🌐 Internationalization

The application supports multiple languages:
- English (en)
- Chinese (zh-CN)

Translation files are located in the `locales` directory.

## 🔒 Code Quality

- Strict TypeScript configuration
- ESLint for code style consistency
- Automated testing with Vitest and Testing Library
- Git hooks for code quality checks
- Conventional commit messages enforced

## 📝 License

Apache-2.0 License
