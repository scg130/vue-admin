FROM nginx:alpine

ADD dist /vue-admin
COPY nginx/admin.conf /etc/nginx/conf.d/admin.conf
RUN chmod -R 755 /vue-admin/*
EXPOSE 80