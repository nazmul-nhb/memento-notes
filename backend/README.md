# Memento Notes Backend

---

## 🚀 Development

Install dependencies

```bash
pnpm install
```

Run in development mode:

```bash
pnpm dev     # or npm run dev / yarn dev
# Runs on port: 4242 by default
```

---

## 📁 Project Structure

```ini
📁 <your-project-name>/
 ├─ 📁 .vscode/
 │   ├─ 📄 extensions.json     # Recommended Extensions for VS Code
 │   └─ 📄 settings.json       # VS Code Settings for better formatting
 │
 ├─ 📁 public/                 # Folder contains static files
 |   └─ 🖼️ favicon.png         # Favicon to show in client application(s) if supported, e.g. Browsers
 │
 ├─ 📁 scripts/                # Helper scripts for development purpose
 │
 ├─ 📁 src/
 │   ├─ 📁 app/                # All source (*.ts) files
 │   |   ├─ 📁 classes/        # Utility classes e.g. `QueryBuilder`, `ErrorWihStatus`
 │   |   ├─ 📁 configs/        # App configurations (CORS, Database, ENV etc.)
 │   |   ├─ 📁 constants/      # Constant values
 │   |   ├─ 📁 errors/         # Custom error processors/handlers
 │   |   ├─ 📁 middlewares/    # Custom Express middlewares
 │   |   ├─ 📁 modules/        # Feature modules (controllers, services, etc.)
 │   |   ├─ 📁 routes/         # Route definitions
 │   |   ├─ 📁 types/          # Types for the App
 │   |   └─ 📁 utilities/      # Helper functions
 │   |
 │   ├─ 📄 app.ts              # Express app setup
 │   ├─ 📄 index.d.ts          # Global type declarations
 │   └─ 📄 server.ts           # Server bootstrap
 │
 ├─ 🔒 .env                    # Environment variables
 ├─ 🚫 .gitignore              # Ignore files/folders from being pushed/committed
 ├─ ⚙️ biome.json              # Biome config 
 ├─ ⚙️ nhb.scripts.config.mjs  # Config for nhb-scripts
 ├─ ⚙️ nodemon.json            # Nodemon config
 ├─ ⚙️ package.json            # Auto-generated `package.json`
 ├─ 📃 README.md               # This file
 ├─ ⚙️ tsconfig.json           # Ready to use tsconfig
 └─ ⚙️ vercel.json             # Deployment config for Vercel
```

---

## 🛠️ Scripts

- `pnpm/npm/yarn run dev` – Start in dev mode with `nodemon` and `ts-node`
- `pnpm/npm/yarn run start` – Run the built server
- `pnpm/npm/yarn run deploy` – Build the project and deploy to Vercel (`nhb-build && vercel --prod`)
- `pnpm/npm/yarn run build` – Build the project for production (`nhb-build`)
- `pnpm/npm/yarn run format` – Format the codebase
- `pnpm/npm/yarn run lint` – Lint the code
- `pnpm/npm/yarn run fix` – Auto‑fix lint issues
- `pnpm/npm/yarn run commit` – Guided commit workflow (`nhb-commit`)
- `pnpm/npm/yarn run count` – Count exports (`nhb-count`)
- `pnpm/npm/yarn run module` – Scaffold new modules (`nhb-module`)
- `pnpm/npm/yarn run delete` – Delete any file/folder from the CLI (`nhb-delete`)
- `pnpm/npm/yarn run secret` – Generate secrets for jwt (using crypto module)
- `pnpm/npm/yarn run typecheck` → runs TypeScript type checking

---

Made with ❤️ by [Nazmul Hassan](https://github.com/nazmul-nhb)

**Powered by [nhb-express](https://www.npmjs.com/package/nhb-express)** 🚀
