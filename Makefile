build:
	docker build -t rest-api-server-v1 .
down:
	docker-compose down --remove-orphans --volumes
up:
	docker-compose --env-file ./.env up --build
shell:
	docker exec -it mongo mongo