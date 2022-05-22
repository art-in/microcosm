# make sure package versions stay in sync with dev image (.devcontainer/Dockerfile)
FROM ubuntu:18.04

# install tools
RUN apt-get update
RUN apt-get install -y curl wget xz-utils git

# install node-gyp build toolchain (for building pouchdb/leveldb npm modules)
RUN apt-get install -y python make gcc g++

# install nodejs (through direct link since apt-get one is old)
RUN mkdir -p /opt/node
WORKDIR /opt/node
RUN curl https://nodejs.org/dist/v9.11.2/node-v9.11.2-linux-x64.tar.xz -o node-v9.11.2-linux-x64.tar.xz
RUN mkdir -p /usr/local/lib/nodejs
RUN tar -xJvf node-v9.11.2-linux-x64.tar.xz -C /usr/local/lib/nodejs
ENV PATH=/usr/local/lib/nodejs/node-v9.11.2-linux-x64/bin:$PATH

# copy build files into image
COPY . /opt/project/
WORKDIR /opt/project/

# download all npm dependencies necessary for production runtime into image
RUN npm config set user root
RUN npm install

# set entry (forwards args from cli)
ENTRYPOINT npm run serve
