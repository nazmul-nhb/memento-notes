# Memento Notes - Frontend

This is the frontend client for the **Memento Notes** application. It is a stunning, dark-mode, responsive web application built for seamless note and post management.

Admin Login:

```ini
Email: admin@memento.com
Password: [PASSWORD]
```

## 🌐 Live Demo

[https://memento-notes.vercel.app/](https://memento-notes.vercel.app/)

## 🚀 Technologies

- **Framework:** React 19, Vite, TypeScript
- **Styling:** Tailwind CSS v4, `shadcn/ui`, Framer Motion, Lucide React
- **Routing:** TanStack Router
- **Data Fetching & State:** TanStack Query (React Query) v5, Axios
- **Form Validation:** React Hook Form, Zod

## ⚙️ Environment Variables

Create a `.env` file in the root of the `frontend` directory:

```env
# The base API URL pointing to the Memento backend
VITE_BASE_API=http://localhost:4242/api
```

## 🛠️ Getting Started

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Run the development server:**

   ```bash
   pnpm dev
   ```

   The app will be available at `http://localhost:5173`.

3. **Build for production:**

   ```bash
   pnpm build
   ```
