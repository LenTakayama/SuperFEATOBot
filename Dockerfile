ARG NODE_VERSION
FROM node:14.16.0

WORKDIR /usr/src/app

ADD package.json ./
ADD yarn.lock ./

# ** [Optional] Uncomment this section to install additional packages. **
RUN apt upgrade \
  && apt install git

RUN yarn install
