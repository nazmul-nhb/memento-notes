# Memento Notes

A Simple, Fast and Secure Note-Taking App built as a monorepo containing both the robust REST API backend and the beautiful frontend client.

## 🌐 Live Demo

- **Frontend Application:** [https://memento-notes.vercel.app/](https://memento-notes.vercel.app/)
- **Backend API:** [https://memento-notes-server.vercel.app/api/](https://memento-notes-server.vercel.app/api/)

## Features

- Create, edit, delete, and search notes and posts
- Admin dashboard for user and content management
- User authentication and role-based access control (Admin/User)
- Secure data storage and hashed passwords
- Responsive, premium dark-mode design
- Paginated list views and group aggregations

## Technologies

- **Frontend**: Vite, React 18, TypeScript, Tailwind CSS v4, shadcn/ui, TanStack Query, TanStack Router
- **Backend**: Express, TypeScript, Mongoose, MongoDB, JWT

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [pnpm](https://pnpm.io/)

### Environment Variables

**Backend (`backend/.env`)**

```bash
MONGO_URI=your_mongo_uri
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_ACCESS_EXPIRES_IN=your_jwt_access_expires_in
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_REFRESH_EXPIRES_IN=your_jwt_refresh_expires_in
SALT_ROUNDS=your_salt_rounds

# Admin Seed Credentials
SEED_ADMIN_EMAIL=admin@memento.com
SEED_ADMIN_PASS=12345678

#Optional
PORT=4242
```

*Note: If the PORT is changed from `4242` to something else, update the `wait` script in the root `package.json`: `"wait": "wait-on tcp:<port>"*

**Frontend (`frontend/.env`)**

```bash
VITE_BASE_API=http://localhost:4242/api
```

### Installation

Install dependencies for both frontend and backend concurrently from the root directory:

```bash
pnpm install:all
```

### Usage

Run both the frontend and backend development servers concurrently:

```bash
pnpm dev
```

### Production

Build and start the application for production:

```bash
pnpm build
pnpm start
```

## 🛡️ Default Admin Access

When the backend starts up for the first time (or if the admin user is not found), it will automatically seed an initial admin user using the credentials provided in your `.env` file:

- **Email**: `admin@memento.com`
- **Password**: `12345678`

You can use these credentials to log in on the frontend and access the Admin Dashboard.

## 📮 Postman API Documentation

A comprehensive [**Postman collection**](Memento%20Notes.postman_collection.json) containing all available endpoints for the application is provided at the root of the project ([Memento Notes.postman_collection.json](Memento%20Notes.postman_collection.json)).

**Note on Usage**:

- All application endpoints are documented within this collection.
- The collection utilizes **Pre-request Scripts** (for all endpoints) and **Post-response Scripts** (specifically for login/refresh token operations) to **automatically manage the `Bearer` token**. Once you authenticate (Login/Register), the token is saved automatically to your Postman environment and attached securely to subsequent requests, so you don't need to configure authorization headers manually.

## 🛠️ Available Scripts (Root)

| Command            | Description                                       |
| ------------------ | ------------------------------------------------- |
| `pnpm install:all` | Install dependencies in both frontend and backend |
| `pnpm dev`         | Run in development mode                           |
| `pnpm build`       | Build the project for production                  |
| `pnpm start`       | Run the built app                                 |
| `pnpm format`      | Format the codebase                               |
| `pnpm lint`        | Lint the code                                     |
| `pnpm fix`         | Auto‑fix lint issues                              |
| `pnpm commit`      | Guided commit workflow                            |
| `pnpm typecheck`   | Runs TypeScript type checking                     |
