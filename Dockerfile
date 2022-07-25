FROM ubuntu:20.04

RUN apt update \
    && apt install curl -y

RUN /bin/bash -c "curl -sL https://deb.nodesource.com/setup_16.x -o /tmp/nodesource_setup.sh \
    && bash /tmp/nodesource_setup.sh \
    && apt install -y nodejs \
    && node -v"

RUN npm install --location=global node-pre-gyp concurrently bcrypt-nodejs

COPY . src
RUN /bin/bash -c "cd src \
    && cd tweak-client \
    && npm install"

RUN /bin/bash -c "cd src \
    && cd tweak-backend \
    && npm install"

EXPOSE 4200
EXPOSE 1337

ENTRYPOINT /bin/bash -c "cd src \
    && npm run dev"