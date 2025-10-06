# NestJS GraphQL API + React Client Example

This project demonstrates a full-stack application built with **NestJS**, **GraphQL**, **React**, and **Redis**.

Since I’m not deeply experienced with GraphQL, I chose NestJS’s **code-first** approach, which let me lean on a framework I know well (NestJS) while learning and applying GraphQL concepts.

---

## 🚀 Getting Started

### Prerequisites
- **Docker** (for running Redis)
- **Node.js >= 22.0.0**
- **Yarn**

The project is structured as a **Turborepo** monorepo. Redis runs inside Docker, while the API and web client run locally.

To spin everything up:

```bash
yarn install
yarn dev
```
website is here http://localhost:5173/ (May need a manual reload on first run)
api is here http://localhost:3000/

## Manual install

If the one‑shot script fails, bring services up manually.

### API

```bash
cd apps/api
yarn install              # dependencies
yarn docker:up            # start Redis
yarn dev

```

### Frontend

```bash
cd apps/web
yarn install
yarn dev            

```

## Use of AI

AI tools were used in the following ways:

- Activity scoring algorithms: AI helped generate the initial heuristics. These still need refinement, as results can be inaccurate (e.g., inland cities getting surf scores of 20/100).
- GraphQL setup: Since I’m less familiar with GraphQL, I consulted AI on configuring Apollo Client in the React frontend and designing the schema.

## Improvements Needed

This code is not production-ready. With more time, I would focus on the following areas:

✅ Testing

Unit and end-to-end tests exist but coverage is incomplete.

✅ Logging & Observability

Proper logging, tracing, and metrics are missing.

✅ Error Handling

Error handling in the API is minimal and should be hardened.

✅ Algorithm Refinement

Improve the scoring logic to better reflect real conditions.
Example: some inland locations rank too high for surfing.

✅ UI/UX

The location form and general frontend UX need significant polish.

✅ GraphQL Codegen

I would leverage GraphQL Code Generator more fully to provide stronger type safety across the stack.

## Summary
This project is a starting point for experimenting with NestJS + GraphQL + React.
It highlights the architectural foundations, demonstrates integration with Redis, and leaves room for iteration on scoring logic, error handling, and user experience.
