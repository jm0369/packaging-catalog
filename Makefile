# Config
COMPOSE = docker compose -f infrastructure/docker-compose.yml
DB_WS   = @pkg/db
API_WS  = @app/api

.PHONY: db-up db-down db-logs migrate reset seed studio gen api

db-up:
	$(COMPOSE) up -d

db-down:
	$(COMPOSE) down -v --remove-orphans

db-logs:
	$(COMPOSE) logs -f

migrate:
	pnpm -F $(DB_WS) migrate:dev --name init

reset:
	pnpm -F $(DB_WS) migrate:reset

seed:
	pnpm -F $(DB_WS) seed

studio:
	pnpm -F $(DB_WS) studio

gen:
	pnpm -F $(DB_WS) generate
	# If you also want to generate client in api workspace (non-centralized):
	pnpm -F $(API_WS) prisma:generate

api:
	pnpm -F $(API_WS) start:dev
reseed:
	pnpm -F $(DB_WS) migrate:reset
	pnpm -F $(DB_WS) seed