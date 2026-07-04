# GitHub Repository Explorer

A monorepo web application that lets you explore commits, authors, and comments for any public GitHub repository. Built with **NestJS** (backend) and **React** (frontend) using TypeScript.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Running with Docker](#running-with-docker)
- [API Endpoints](#api-endpoints)
- [Running Tests](#running-tests)
- [Scripts Reference](#scripts-reference)
- [Environment Variables](#environment-variables)

## Features

- Search any public GitHub repository by `owner/repo`
- View all commits with author details, commit title, and comment count
- Browse unique commit authors with avatars, profile links, and commit counts
- View all commit comments with commenter details and links to GitHub
- Filter commits by author using a dropdown
- Click on comment count to preview comments inline
- "See More" pagination on all three sections
- In-memory caching with request deduplication to minimize GitHub API usage

## Tech Stack

| Layer    | Technology                        |
| -------- | --------------------------------- |
| Backend  | NestJS 10, Axios, TypeScript      |
| Frontend | React 18, Vite 6, TypeScript      |
| Testing  | Jest, ts-jest, @nestjs/testing     |
| Tooling  | Prettier, EditorConfig, npm workspaces |
| Docker   | Multi-stage builds, Docker Compose |

## Project Structure

```
i6-assessment/
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
├── .dockerignore
├── .editorconfig
├── .gitignore
├── .npmrc
├── .nvmrc
├── .prettierrc
├── .prettierignore
├── package.json
├── tsconfig.base.json
│
└── services/
    ├── backend/                          # NestJS API (port 3001)
    │   ├── src/
    │   │   ├── main.ts
    │   │   ├── app.module.ts
    │   │   ├── helpers/
    │   │   │   ├── cache.ts              # In-memory cache with TTL & deduplication
    │   │   │   ├── paginate.ts           # GitHub API paginator
    │   │   │   ├── github-error.ts       # Axios error handler
    │   │   │   ├── map-comments.ts       # Comment response mapper
    │   │   │   └── __tests__/            # Helper unit tests
    │   │   └── modules/
    │   │       └── repos/
    │   │           ├── repos.module.ts
    │   │           ├── repos.controller.ts
    │   │           ├── repos.service.ts
    │   │           ├── types.ts
    │   │           └── __tests__/        # Module unit tests
    │   ├── .env.example
    │   ├── jest.config.js
    │   ├── nest-cli.json
    │   ├── tsconfig.json
    │   └── package.json
    │
    └── frontend/                         # React + Vite App (port 3000)
        ├── index.html
        ├── src/
        │   ├── main.tsx                  # App entry point
        │   ├── App.tsx                   # Root component
        │   ├── api.ts
        │   ├── types.ts
        │   └── components/
        │       ├── SearchBar.tsx
        │       ├── AuthorFilter.tsx
        │       ├── AuthorsSection.tsx
        │       ├── CommitsTable.tsx
        │       ├── CommentPanel.tsx
        │       ├── CommentsSection.tsx
        │       └── Loader.tsx
        ├── .env.local
        ├── vite.config.ts
        ├── tsconfig.json
        └── package.json
```

## Prerequisites

- **Node.js** >= 24 (see `.nvmrc`)
- **npm** >= 11
- **Docker** and **Docker Compose** (optional, for containerized setup)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

**Backend:**

```bash
cp services/backend/.env.example services/backend/.env
```

Edit `services/backend/.env` and add your GitHub Personal Access Token (optional but recommended — without it you're limited to 60 API requests/hour).

> **Don't have a token?** A demo token is already included in `services/backend/.env.example`. You can use it directly by copying the file as-is — no changes needed.

**Frontend:**

The frontend ships with a `.env.local` file preconfigured:

```env
VITE_API_BASE=http://localhost:3001/api/v1/repos
```

Update this if your backend runs on a different host or port.

### 3. Start both services

```bash
npm run dev
```

This starts:
- **Backend** at http://localhost:3001
- **Frontend** at http://localhost:3000

You can also start them individually:

```bash
npm run dev:backend   # Backend only
npm run dev:frontend  # Frontend only
```

### 4. Open the app

Navigate to http://localhost:3000 and enter a repository like `octocat/Spoon-Knife` in the search bar.

## Running with Docker

### Build and start

```bash
docker compose up --build
```

The token is loaded from `services/backend/.env.example` by default. To override:

```bash
GITHUB_TOKEN=your_token docker compose up --build
```

### Stop

```bash
docker compose down
```

## API Endpoints

All endpoints are under `http://localhost:3001/api/v1/repos/:owner/:repo`

| Method | Endpoint     | Description                                                                 |
| ------ | ------------ | --------------------------------------------------------------------------- |
| GET    | `/commits`   | All commits with author/committer details, title, and comment count         |
| GET    | `/authors`   | Unique commit authors with avatar, username, profile URL, and commit count  |
| GET    | `/comments`  | All commit comments with commit SHA, commenter details, body, and HTML URL  |

### Example

```bash
# Get commits for octocat/Spoon-Knife
curl http://localhost:3001/api/v1/repos/octocat/Spoon-Knife/commits

# Get unique authors
curl http://localhost:3001/api/v1/repos/octocat/Spoon-Knife/authors

# Get commit comments
curl http://localhost:3001/api/v1/repos/octocat/Spoon-Knife/comments
```

## Running Tests

### Run all backend tests

```bash
npm run test:backend
```

### Run with coverage

```bash
npm run test:backend -- --coverage
```

### Test suites

| Suite                       | Covers                                                       |
| --------------------------- | ------------------------------------------------------------ |
| `cache.spec.ts`             | TTL expiry, cache hit/miss, concurrent request deduplication  |
| `paginate.spec.ts`          | Single page, Link header pagination, maxPages limit           |
| `github-error.spec.ts`      | 404, 403, other status codes, non-Axios errors                |
| `map-comments.spec.ts`      | Comment response mapping                                      |
| `repos.service.spec.ts`     | Commits, authors, comments mapping and edge cases             |
| `repos.controller.spec.ts`  | Controller delegates to service correctly                     |

## Scripts Reference

| Script               | Description                          |
| -------------------- | ------------------------------------ |
| `npm run dev`        | Start both backend and frontend      |
| `npm run dev:backend`  | Start backend in watch mode        |
| `npm run dev:frontend` | Start frontend dev server          |
| `npm run build:backend`  | Build backend                    |
| `npm run build:frontend` | Build frontend                   |
| `npm run test:backend`   | Run backend unit tests            |
| `npm run format`     | Format all files with Prettier       |
| `npm run format:check` | Check formatting without writing   |

## Environment Variables

### Backend (`services/backend/.env`)

| Variable       | Required | Default | Description                                    |
| -------------- | -------- | ------- | ---------------------------------------------- |
| `GITHUB_TOKEN` | Yes      | —       | GitHub Personal Access Token for higher rate limits (60/hr without, 5000/hr with) |

To create your own token: GitHub Settings > Developer settings > Personal access tokens > Tokens (classic) > Generate new token. No scopes are needed for public repository data.

> **Quick start:** If you don't have a token, a demo token is already provided in `services/backend/.env.example`. Simply copy it to `.env` and you're good to go.

### Frontend (`services/frontend/.env.local`)

| Variable         | Required | Default                                    | Description               |
| ---------------- | -------- | ------------------------------------------ | ------------------------- |
| `VITE_API_BASE`  | No       | `http://localhost:3001/api/v1/repos`       | Backend API base URL      |

## Development

This assessment was developed using [Devin](https://devin.ai) — an AI software engineering tool that assisted with code generation, project structuring, and implementation across the full stack.
