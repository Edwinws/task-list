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

## Design Decisions

- Uses Prisma as the ORM
  - Personal preference. It allows for type-safe queries, easy management of the DB schema via the `schema.prisma` file
  - Improvement: It (still) doesn't support polymorphic relations https://github.com/prisma/prisma/issues/1644
- Uses the standard Service pattern
  - Improvement: The Service-Repository pattern would be preferred, where there would also be a repository layer to manage and isolate the data access logic for the data layer.
- Validation
  - Validation is done using the class-validator package which has a innate integration with NestJS via the `@Body()` decorator
  - Improvement: validation should also be done in the service layer, as typically a service method may be called by another service method, or via another source other than the REST endpoint, e.g. a Kafka consumer
- Data separation layer between controller and service
  - To separate the controller from the service, and provide standardized API into the service regardless of the caller - e.g. the (REST) controller, a kafka consumer or another service
  - If a repository layer is used, there would also be the same separation of layers (i.e. different types in and out of the layer)
