# task-list

## Prerequisite Software

- `pnpm`: https://pnpm.io/installation#on-posix-systems
- `docker`: https://www.docker.com/

## Start (Development)

Run these:

- `cd task-list-backend && pnpm i && cd ../task-list-frontend && pnpm i && cd ..`
- `docker compose up`
- go to http://localhost:3001 on your browser

## Start (Production build)

- Update the backend's `.env` to use the production string for `DATABASE_URL`
- Run the following from the root folder:
  - `docker build -f task-list-backend/Dockerfile-prod ./task-list-backend -t task-list:latest`
  - `docker run --env-file=./task-list-backend/.env -p "3000:3000" task-list:latest`
  - `docker build -f task-list-frontend/Dockerfile-prod ./task-list-frontend -t task-list-frontend:latest`
  - `docker run --env-file=./task-list-frontend/.env -p "3001:3001" task-list-frontend:latest`
- Go to your browser at `localhost:3000`

## Notes:

- I've commited the .env file to simplify running the application locally

## Commands

### Backend

#### To sync and create migration (if required) after updating schema.prisma

```
docker exec -it task-list-backend-1 sh
db:migrate-dev
```

#### To reset DB and rerun all migrations (deletes all data)

```
docker exec -it task-list-backend-1 sh
db:reset
```
