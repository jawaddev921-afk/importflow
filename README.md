# importflow

A complete, self-hostable CSV and Excel data import SaaS platform that handles file parsing, relational column mapping, real-time validation, and webhook dispatching for external applications.

---

## What This Project Does

Ingesting user-submitted CSV and Excel spreadsheets into web applications is notoriously error-prone, requiring custom parsers, schema validation rules, column matching, and error correction flows. Building bespoke import interfaces for every product distracts development teams from core business logic.

**importflow** provides production-grade, embeddable data onboarding infrastructure. It delivers a turnkey spreadsheet import modal with intelligent header matching, cell-level validation, spreadsheet error-correction tables, and resilient distributed queue processing.

### Key Features
* **Embeddable Import Widget:** Drop-in spreadsheet import wizard for React, Angular, and vanilla JavaScript applications.
* **Intelligent Column Mapping:** Automatically matches spreadsheet columns to target data schema with fuzzy header recognition and validation constraints.
* **In-Browser Cell Correction:** Interactive spreadsheet grid (powered by Handsontable) allowing users to fix invalid cells in place before submitting data.
* **Distributed Queue Architecture:** Offloads heavy file parsing and row-by-row validation to dedicated RabbitMQ queue workers, preventing API thread exhaustion during high-volume imports.
* **Pluggable Validation Rules:** Configure required fields, data formats, regex patterns, uniqueness checks, and external REST lookups.
* **Webhook & Destination Dispatch:** Streams cleaned and validated records directly to target endpoints or database sinks with configurable batching and retries.
* **Administrative Management Portal:** Next.js dashboard for inspecting import history, editing schema/destination/validator/output settings, and managing team members and billing.

---

## How It Works

The platform operates as a modular monorepo combining client SDKs, an API gateway, asynchronous queue workers, and an administrative dashboard:

```mermaid
flowchart TD
    UserApp["Host Web Application (React / Angular / Vanilla)"]
    Widget["ImportFlow Widget (@importflow/widget)"]
    Admin["Admin Portal (@importflow/web)"]

    subgraph "Backend Infrastructure"
        API["API Service (@importflow/api)\nNestJS Gateway"]
        QM["Queue Manager (@importflow/queue-manager)\nRabbitMQ Consumer & Parser"]
        DAL["Data Access Layer (@importflow/dal)\nMongoDB Repositories"]
    end

    subgraph "Storage & Brokers"
        Queue[("RabbitMQ\nJob & Chunk Queues")]
        DB[("MongoDB\nTemplates, Schemas, Uploads")]
        Storage[("Storage Provider\n(S3 / Azure)")]
    end

    Webhook["External Webhook / Destination API"]

    UserApp -->|Mounts| Widget
    Widget -->|Upload File & Validate| API
    Admin -->|Manage Schemas & Projects| API
    API -->|Write Metadata| DAL
    API -->|Store Raw Upload| Storage
    API -->|Publish Processing Task| Queue
    DAL --> DB
    Queue -->|Consume Task| QM
    QM -->|Fetch Raw File| Storage
    QM -->|Validate Rows| DAL
    QM -->|Dispatch Batched Records| Webhook
```

---

## Project Structure

```
importflow/
├── apps/
│   ├── api/                # NestJS core REST API (projects, templates, columns, uploads)
│   ├── queue-manager/      # Distributed RabbitMQ background worker for file processing
│   ├── web/                # Next.js administrative dashboard and template management UI
│   └── widget/             # Embeddable import UI wizard (React + Handsontable grid)
├── libs/
│   ├── dal/                # MongoDB Data Access Layer schemas, models, and repositories
│   ├── embed/              # Vanilla JavaScript iframe wrapper for loading the widget
│   ├── services/           # Storage, email, payment, bubble, naming, and RSS/XML services
│   └── shared/             # Shared TypeScript types, enums, DTOs, and constants
├── packages/
│   ├── angular/            # Angular wrapper component for the ImportFlow widget
│   ├── client/             # Headless TypeScript client for programmatic imports
│   └── react/              # React wrapper hook and component for the ImportFlow widget
├── lerna.json              # Lerna multi-package versioning configuration
├── nx.json                 # Nx monorepo pipeline and caching configuration
├── package.json            # Root workspace scripts and dependencies
├── pnpm-workspace.yaml     # pnpm workspace monorepo definition
└── tsconfig.base.json      # Base TypeScript compiler options and monorepo path aliases
```

---

## Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Monorepo Engine** | Nx 13.8 & Lerna 4.0 | Task orchestration, project dependency graph, and monorepo tooling |
| **Backend Framework** | NestJS 8.4 (Node.js) | Modular architecture for API gateway and background queue workers |
| **Frontend Dashboard** | Next.js 12.1 & React 17.0 | Import history, schema/destination/validator/output settings, teams, and billing |
| **Import Widget UI** | React 17.0 & Handsontable 11.1 | In-browser spreadsheet grid with live cell validation and corrections |
| **Language** | TypeScript 4.6 | Monorepo-wide type safety and shared contract interfaces |
| **Primary Database** | MongoDB via Mongoose 6.2 | Document store for projects, templates, column schemas, and upload logs |
| **Message Broker** | RabbitMQ via `amqplib` 0.8 and `amqp-connection-manager` 4.1 | Decoupled asynchronous file parsing, chunk validation, and dispatching |
| **Object Storage** | AWS SDK v3 (S3) 3.54 & Azure Blob 12.9 | Raw upload storage for S3-compatible or Azure Blob backends |
| **File Parsing** | `exceljs` 4.3, `xlsx` 0.20.1, `xlsx-populate` 1.21 & `papaparse` 5.3 | CSV and XLS/XLSX parsing, streaming, and spreadsheet generation |

---

## How to Run This Project

### 1. Prerequisites
* **Node.js**: `v16.x` or `v18.x` (the monorepo targets 2022-era tooling)
* **Package Manager**: `pnpm` 7.x
* **MongoDB**: Active instance running on port `27017`
* **RabbitMQ**: Active instance running on port `5672` (management UI on `15672`)
* **Object storage**: An S3-compatible API such as MinIO, or Azure Blob Storage, for uploaded files

### 2. Clone via GitHub
```bash
git clone https://github.com/jawaddev921-afk/importflow.git
cd importflow
```

### 3. Install Dependencies
```bash
pnpm install
```

### 4. Environment Configuration
Each application reads its own env file. Copy the examples manually:

```bash
cp .env.example .env
cp apps/api/src/.example.env apps/api/src/.env
cp apps/web/.example.env apps/web/.env
cp apps/widget/.example.env apps/widget/.env
cp apps/queue-manager/src/.example.env apps/queue-manager/src/.env
```

The root `.env` supplies billing/SubOS settings used by the dashboard (`NEXT_PUBLIC_PAYMENT_GATEWAY_URL`, `NEXT_PUBLIC_SUBOS_PROJECT_ID`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`). Add them to `apps/web/.env` when enabling billing.

Key environment settings:
* `MONGO_URL`: MongoDB connection string (`mongodb://localhost:27017/importflow-db`)
* `RABBITMQ_CONN_URL`: RabbitMQ connection string (`amqp://guest:guest@localhost:5672`)
* `JWT_SECRET`: Signing secret for user authentication tokens
* `PORT`: API server port (default: `3000`)
* `WIDGET_BASE_URL` / `WEB_BASE_URL`: Public widget and dashboard URLs used in links
* `STORAGE_TYPE`: `s3` or `azure`, plus the matching storage credentials
* `NEXT_PUBLIC_API_BASE_URL`: Dashboard-to-API URL (`http://localhost:3000`)
* `REACT_APP_API_URL`: Widget-to-API URL (`http://localhost:3000`)

### 5. Database Setup

MongoDB creates collections on first write and no migrations are included in this source snapshot. Point `MONGO_URL` at a running MongoDB instance; see `libs/dal/src/repositories` for the schemas and indexes.

### 6. Run

* **Start All Services in Development (Parallel):**
  ```bash
  pnpm run start:dev
  ```
  Expect the API on `http://localhost:3000`, the dashboard on `http://localhost:4200`, and the widget on `http://localhost:3500`.

* **Start Individual Monorepo Applications:**
  * Start API: `pnpm run start:api`
  * Start Queue Manager: `pnpm run start:queue-manager`
  * Start Dashboard: `pnpm run start:web`
  * Start Widget: `pnpm run start:widget`

* **Build All Workspace Targets:**
  ```bash
  pnpm run build
  ```

### 7. Lint
```bash
pnpm run lint
```

### 8. Source Snapshot Notes
This repository contains application source only. Tests, Docker definitions, database migrations, the lockfile, and the license file are not included. Runtime data such as uploaded files and generated import artifacts is created outside the repository. `pnpm install` runs the workspace build through the root `postinstall` hook.
