SERVER_REPOSITORY_NAME:=teamF/scenepicks
SERVER_CONTAINER_NAME:=scenepicks

DBNAME:=nexus_db
DOCKER_DNS:=db
FLYWAY_CONF?=-url=jdbc:mysql://$(DOCKER_DNS):3306/$(DBNAME) -user=root -password=password

HOST_APP_BASE:=$(shell pwd)
DOCKER_APP_BASE:=/go/src/github.com/shortintern2020-C-cryptograph/TeamF/server

# ローカルでサーバを立ち上げる
local/run:
	docker-compose -f ./docker-compose.yml up -d db
	cd server && make run
	@echo 'connect server port :3000 !!!'

docker/run:
	docker-compose -f ./docker-compose.yml build --no-cache
	docker-compose -f ./docker-compose.yml up -d
#	$(MAKE) docker/run/server
#	$(MAKE) docker/run/db

docker/run/server:
	#docker run -d --name $(SERVER_CONTAINER_NAME) -p 1323:1323 -v $(HOST_APP_BASE):$(DOCKER_APP_BASE) $(SERVER_REPOSITORY_NAME):latest
	docker-compose -f ./docker-compose.yml up -d server
	@echo 'connect server port :8080 !!!'

docker/stop:
	docker-compose down
	#$(MAKE) docker/stop/server
	#docker container rm $(SERVER_CONTAINER_NAME)

docker/stop/server:
	docker-compose down

local/run/frontend:
	cd app && yarn && yarn run dev
	@echo 'frontend served at port 3000 !'

local/stop:
	docker-compose down

DB_SERVICE:=db
mysql/client:
	docker-compose exec $(DB_SERVICE) mysql -uroot -hlocalhost -ppassword $(DBNAME)

mysql/init:
	docker-compose exec $(DB_SERVICE) \
		mysql -u root -h localhost -ppassword \
		-e "create database \`$(DBNAME)\`"

__mysql/drop:
	docker-compose exec $(DB_SERVICE) \
		mysql -u root -h localhost -ppassword \
		-e "drop database \`$(DBNAME)\`"


MIGRATION_SERVICE:=migration
flyway/info:
	docker-compose run --rm $(MIGRATION_SERVICE) $(FLYWAY_CONF) info

flyway/validate:
	docker-compose run --rm $(MIGRATION_SERVICE) $(FLYWAY_CONF) validate

flyway/migrate:
	docker-compose run --rm $(MIGRATION_SERVICE) $(FLYWAY_CONF) migrate

flyway/repair:
	docker-compose run --rm $(MIGRATION_SERVICE) $(FLYWAY_CONF) repair

flyway/baseline:
	docker-compose run --rm $(MIGRATION_SERVICE) $(FLYWAY_CONF) baseline

flyway/clean:
	docker-compose run --rm $(MIGRATION_SERVICE) $(FLYWAY_CONF) clean

