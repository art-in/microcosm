FROM ubuntu:18.04

# install tools
RUN apt-get update
RUN apt-get install -y curl wget xz-utils git

# install node-gyp build toolchain (for building pouchdb/leveldb npm modules)
RUN apt-get install -y python make gcc g++

# auto convert line endings (CRLF to LF) if on windows host
RUN git config --global core.autocrlf true

# install nodejs (through direct link since apt-get one is old)
RUN mkdir -p /opt/node
WORKDIR /opt/node
RUN curl https://nodejs.org/dist/v9.11.2/node-v9.11.2-linux-x64.tar.xz -o node-v9.11.2-linux-x64.tar.xz
RUN mkdir -p /usr/local/lib/nodejs
RUN tar -xJvf node-v9.11.2-linux-x64.tar.xz -C /usr/local/lib/nodejs
ENV PATH=/usr/local/lib/nodejs/node-v9.11.2-linux-x64/bin:$PATH

# install chrome for running tests
RUN mkdir -p /opt/chrome
WORKDIR /opt/chrome
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt install -y ./google-chrome-stable_current_amd64.deb

# set the default shell to bash instead of sh
ENV SHELL /bin/bash