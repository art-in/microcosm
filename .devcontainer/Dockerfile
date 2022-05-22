# make sure package versions stay in sync with prod image (docker/Dockerfile)
# TODO: share base image config for dev and prod images to avoid duplication
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

# install chrome (for running tests)
RUN mkdir -p /opt/chrome
WORKDIR /opt/chrome
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt install -y ./google-chrome-stable_current_amd64.deb

# install docker (for building and publishing images with production build into docker hub)
RUN apt-get install -y ca-certificates gnupg lsb-release
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
RUN  echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
RUN apt-get update
RUN apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# fix "EACCES user "undefined" does not have permission to access the dev dir" error on npm install
RUN npm config set user root

# auto convert line endings (CRLF to LF) if on windows host
RUN git config --global core.autocrlf true

# mark project directory as safe so git won't complain when files owned by any user
RUN git config --global --add safe.directory /workspaces/microcosm

# set the default shell to bash instead of sh
ENV SHELL /bin/bash