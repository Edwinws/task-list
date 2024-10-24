# task-list

## Prerequisite Software

- `pnpm`: https://pnpm.io/installation#on-posix-systems
- `docker`: https://www.docker.com/

## Start (Development)

Run these:

- `cd task-list-backend && pnpm i`
- `docker compose up`

## Start (Production build)

- Update the `.env` to use the production string for `DATABASE_URL`
- Run the following:
  - `docker build -f Dockerfile-prod . -t task-list:latest`
  - `docker run --env-file=./.env -p "3000:3000" task-list:latest`
- Go to your browser at `localhost:3000`

## Notes:

- I've commited the .env file to simplify running the application locally
