.PHONY: install
install:
	npm install

.PHONY: build
build:
	npm run build

.PHONY: docker
docker: 
	docker build . -t scg130/vue-admin:latest

.PHONY: push
push: 
	docker push scg130/vue-admin

.PHONY: run
run:
	npm run serve