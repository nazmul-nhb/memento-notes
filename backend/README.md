# Memento Notes Backend

This is the backend REST API for **Memento Notes**, built with Express, TypeScript, and MongoDB.

## 🌐 Live Demo

[https://memento-notes-server.vercel.app/api](https://memento-notes-server.vercel.app/api/)

---

## 🚀 Environment Setup

Create a `.env` file in the root of the `backend` directory:

```env
# MongoDB Connection
MONGO_URI=your_mongo_uri

# JWT Authentication
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_ACCESS_EXPIRES_IN=your_jwt_access_expires_in # e.g. 15m
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_REFRESH_EXPIRES_IN=your_jwt_refresh_expires_in # e.g. 7d

# Password Hashing
SALT_ROUNDS=12

# Admin Seed Credentials
SEED_ADMIN_EMAIL=admin@memento.com
SEED_ADMIN_PASS=12345678

# Server Port (Optional)
PORT=4242
```

## 🚀 Development

Install dependencies:

```bash
pnpm install
```

Run in development mode:

```bash
pnpm dev     # Runs on port: 4242 by default
```

## 🛡️ Default Admin Access

Upon application startup, if no admin user exists, the backend will seed a default admin account using the environment variables:

- **Email**: `admin@memento.com` (from `SEED_ADMIN_EMAIL`)
- **Password**: `12345678` (from `SEED_ADMIN_PASS`)

Use these credentials to authenticate as an admin on the client side.

---

## 📊 Database Indexing Strategy

In accordance with the project requirements, specific indexes have been applied directly to the Mongoose schemas using `schema.index(...)` to ensure efficient queries for both general operations and specific aggregations.

### Applied Indexes

- **`userSchema`**:
  - `email: 'asc'` (Unique): Optimized for fast login and exact-match lookups.
  - `created_at: 'desc'`: Optimized for paginated list views of users.
  - `interests: 'asc'`: Optimized for the Aggregation Pipeline that groups users by interest.
- **`noteSchema`**:
  - `user_id: 'asc', created_at: 'desc'`: Compound index to optimize queries where users fetch their own paginated lists of notes.
  - `created_at: 'desc'`: Optimized for the admin dashboard where all notes are retrieved in a paginated list.
- **`postSchema`**:
  - `created_at: 'desc'`: Optimized for paginated listing of posts.
  - `user_id: 'asc'`: Optimized for the `$lookup` aggregation scenario where user posts are joined/retrieved.

*Note: Unnecessary indexes have been strictly avoided. Only the indexes strictly required to support list views, single item retrieval, and aggregation pipelines have been defined.*

---

## 📁 Project Structure

```ini
📁 backend/
 ├─ 📁 public/                 # Folder contains static files
 │
 ├─ 📁 src/
 │   ├─ 📁 app/                # All source (*.ts) files
 │   |   ├─ 📁 classes/        # Utility classes e.g. `QueryBuilder`, `ErrorWihStatus`
 │   |   ├─ 📁 configs/        # App configurations (CORS, Database, ENV etc.)
 │   |   ├─ 📁 constants/      # Constant values
 │   |   ├─ 📁 errors/         # Custom error processors/handlers
 │   |   ├─ 📁 middlewares/    # Custom Express middlewares
 │   |   ├─ 📁 modules/        # Feature modules (controllers, services, models)
 │   |   ├─ 📁 routes/         # Route definitions
 │   |   ├─ 📁 types/          # Types for the App
 │   |   └─ 📁 utilities/      # Helper functions
 │   |
 │   ├─ 📄 app.ts              # Express app setup
 │   ├─ 📄 index.d.ts          # Global type declarations
 │   └─ 📄 server.ts           # Server bootstrap
 │
 ├─ 🔒 .env                    # Environment variables
 ├─ ⚙️ package.json            # Auto-generated `package.json`
 └─ 📃 README.md               # This file
```

---

## 🛠️ Scripts

- `pnpm dev` – Start in dev mode with `nodemon` and `ts-node`
- `pnpm start` – Run the built server
- `pnpm build` – Build the project for production
- `pnpm format` – Format the codebase
- `pnpm lint` – Lint the code
- `pnpm fix` – Auto‑fix lint issues
- `pnpm commit` – Guided commit workflow
- `pnpm typecheck` – Runs TypeScript type checking

---

Made with ❤️ by [Nazmul Hassan](https://github.com/nazmul-nhb)

**Powered by [nhb-express](https://www.npmjs.com/package/nhb-express)** 🚀
