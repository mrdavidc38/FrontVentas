FROM node:16-alpine as build-step
run mkdir -p /app
workdir /app
copy package.json /app
run npm install
copy . /app
run npm run build --prod

from nginx:1.17.1-alpine

copy --from=build-step /app/dist//app-ventas /usr/share/nginx/html