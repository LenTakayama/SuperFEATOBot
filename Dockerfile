ARG NODE_VERSION
FROM node:${NODE_VERSION}

WORKDIR /usr/src/app

ADD package.json ./
ADD yarn.lock ./

# ** [Optional] Uncomment this section to install additional packages. **
RUN apt upgrade \
  && apt install git

RUN yarn install

CMD yarn run production
