# Honocorp - SaaS Backend API

Honocorp is a modern, high-performance SaaS backend built with **Hono.js**, **Node.js**, **TypeScript**, and **Drizzle ORM**. It features a clean, layered architecture designed for scalability, maintainability, and fast API response times.

---

## 1. ✨ Key Features & Architecture

* **Layered Architecture:** Clear separation of concerns following `Controllers -> Services -> Schemas/Validations -> Utilities`.
* **Authentication:** User registration, login, and request validation.
* **User Management:** User profile handling and data retrieval.
* **Project Management:** Project creation, retrieval, updates, and paginated listing.
* **Standardized JSON Responses:** Uniform success and error payload formats with pagination metadata.
* **Database Migrations & Seeders:** Automated schema migrations and dummy data seeding powered by Drizzle ORM.
* **Structured Logging:** Centralized HTTP request and application logging powered by Pino.

---

## 2. 📁 Project Structure Breakdown

```text
honocorp/
├── docs/                 # Documentation and tasks
├── src/
│   ├── config/           # Database, environment, and logger configuration
│   ├── db/
│   │   ├── migrations/   # Drizzle migration files and snapshots
│   │   ├── schema/       # Database table schema definitions
│   │   └── seeders/      # Database seeders
│   ├── http/
│   │   ├── controllers/  # Request handlers
│   │   ├── middlewares/  # HTTP request middlewares (logging, auth)
│   │   ├── routes/       # API route declarations
│   │   └── validations/  # Zod validation schemas
│   ├── services/         # Core business logic layer
│   ├── utils/            # Shared utilities (response, pagination, errors)
│   ├── app.ts            # Hono application setup and middleware mounting
│   └── server.ts         # Server entrypoint
├── drizzle.config.ts     # Drizzle ORM configuration
├── package.json
└── tsconfig.json
```

---

## 3. ⚙️ Environment Configuration (`.env`)

Create a `.env` file in the root directory based on `.env.example`:

```env
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=honocorp
```

---

## 4. 🚦 Getting Started / Setup Guide

### Prerequisites
* **Node.js:** v18.0.0 or higher
* **MySQL / MariaDB:** Database server running locally or remotely

### Installation Steps

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   ```
   *(Update `.env` with your local database credentials)*

3. **Run Database Migrations:**
   ```bash
   npm run db:migrate
   ```
   *(Or push schema directly during development via `npm run db:push`)*

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The server will start listening at `http://localhost:3000`.

---

## 5. 📜 Available NPM Scripts

* `npm run dev` – Starts the development server with hot reload (`tsx watch src/server.ts`)
* `npm run build` – Compiles TypeScript source files into `dist/`
* `npm run start` – Runs the compiled production server (`node dist/server.js`)
* `npm run db:generate` – Generates new migration SQL files based on schema changes
* `npm run db:push` – Pushes schema changes directly to the database without generating migration files
* `npm run db:migrate` – Executes pending database migrations
* `npm run db:studio` – Launches Drizzle Studio UI to inspect and manage database records

---

## 6. 📡 API Endpoint Overview

| Method | Endpoint | Description | Auth / Access |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/v1/auth/register` | Register a new user account | Public |
| `POST` | `/api/v1/auth/login` | User authentication / login | Public |
| `GET` | `/api/v1/users` | List users with pagination | Protected |
| `GET` | `/api/v1/users/:id` | Get user details by ID | Protected |
| `GET` | `/api/v1/projects` | List projects with pagination | Protected |
| `POST` | `/api/v1/projects` | Create a new project | Protected |
| `GET` | `/api/v1/projects/:id` | Get project details by ID | Protected |
| `PUT` | `/api/v1/projects/:id` | Update project details | Protected |
| `DELETE` | `/api/v1/projects/:id` | Delete a project | Protected |
