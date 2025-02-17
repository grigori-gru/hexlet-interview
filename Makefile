test:
	npm run test

setup:
	cp -n .env.example development.env || true
	npm run fixtures:load

install:
	npm install

start:
	npm run start:dev

lint:
	npm run lint

db-up:
	docker-compose up -d
db-down:
	docker-compose down

db-console:
	docker-compose exec db psql -U test -d interview
db-console-test:
	docker-compose exec db_test psql -U test -d interview-test

fixtures-load:
	npm run fixtures:load

reset-db:
	npm run schema:drop && npm run migration:run && npm run fixtures:load

.PHONY: test
