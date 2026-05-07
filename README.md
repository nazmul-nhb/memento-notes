# Memento Notes

A Simple, Fast and Secure Note-Taking App

## Features

- Create notes
- Edit notes
- Delete notes
- Search notes
- User authentication
- Secure data storage
- Responsive design

## Technologies

- **Frontend**: Vite, React, TypeScript, Tailwind CSS
- **Backend**: Express, TypeScript, Mongoose

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

#### Environment Variables for Backend

```bash

MONGO_URI=your_mongo_uri
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_ACCESS_EXPIRES_IN=your_jwt_access_expires_in
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_REFRESH_EXPIRES_IN=your_jwt_refresh_expires_in
SALT_ROUNDS=your_salt_rounds

#Optional
PORT=your_port #default is `4242`
```

### Installation

```bash
pnpm install:all
```

### Usage

```bash
pnpm dev
```

### Production

```bash
pnpm build

pnpm start
```

## 🛠️ Available Scripts for both frontend and backend

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
