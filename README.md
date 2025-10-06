# Nestjs graphql API + React client example

## Install

### Prerequisites
 - docker
 - node >= 22.0.0
 - yarn

Docker hosts Redis; the API and web client run locally (hence the Node/Yarn requirement).
Both API and client live in a Turborepo, so the quickest way to get everything up is:

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

## AI 

AI was used to create the algorithms for calculating the activity scores. 
These clearly need tweaking

## Improvements

This I not production ready code:

### Testing

both unit and end to tests have been setup but the coverage is nowhere near where it should be.

### Logging/Oberservability

### Error handling

### Algorithm improvements

### UI/UX
