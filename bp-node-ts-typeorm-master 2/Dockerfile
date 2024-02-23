#FROM node:lts-buster
#Build step, on a heavier linux version.

FROM public.ecr.aws/sg/node:18-alpine as build
ARG NPM_TOKEN
COPY . /var/app/ts-bp-be

WORKDIR /var/app/ts-bp-be
RUN npm ci
RUN npm run build

#lighter server image
FROM public.ecr.aws/sg/node:18-alpine
WORKDIR /var/app/ts-bp-be

ARG NPM_TOKEN

#Copy package.json
COPY ./package*.json ./
#Copy prebuild dist
COPY --from=build /var/app/ts-bp-be/dist ./dist
COPY ./locales ./locales
#COPY ./mail-template ./mail-template
#COPY ./swagger-doc ./swagger-doc
COPY .npmrc .npmrc
#Copy npm pacakges with prod flag
RUN npm ci --omit=dev
COPY .env .env
EXPOSE 80
CMD ["npm","run","serve"]