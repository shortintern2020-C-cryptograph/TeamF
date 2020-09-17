SERVER_REPOSITORY_NAME:=teamF/scenepicks
SERVER_CONTAINER_NAME:=scenepicks

HOST_APP_BASE:=$(shell pwd)
DOCKER_APP_BASE:=/go/src/github.com/shortintern2020-C-cryptograph/TeamF/server

local/run:
	cd server && make run
	@echo 'connect server port :3000 !!!'

docker/run:
	$(MAKE) docker/run/server
	#$(MAKE) docker/run/db

docker/run/server:
	#docker run -d --name $(SERVER_CONTAINER_NAME) -p 1323:1323 -v $(HOST_APP_BASE):$(DOCKER_APP_BASE) $(SERVER_REPOSITORY_NAME):latest
	docker-compose -f ./docker-compose.yml up server
	@echo 'connect server port :3000 !!!'

docker/stop:
	$(MAKE) docker/stop/server
	docker container rm $(SERVER_CONTAINER_NAME)


docker/stop/server:
	docker container stop $(SERVER_CONTAINER_NAME)

