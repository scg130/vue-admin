node v16.14.0

npm  8.18.0

yum install -y nodejs npm

npm install

npm install -g npm@8.18.0

npm install -g @vue/cli-service


docker 环境编辑

docker run -ti --rm -v /Users/shemingdong/go/src/vue-admin:/vue-admin -p 8088:80 coexcz/node-alpine /bin/bash



docker run -d --rm -p 8088:80 scg130/vue-admin