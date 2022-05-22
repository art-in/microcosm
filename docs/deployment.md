microcosm can be deployed in two ways
- by copying build files to serve site and running nodejs on it
- by publishing docker image to Docker Hub, pulling and running it on serve site

# Deploy by copy

## on build site
1. [install nodejs](https://nodejs.org/en/download/)
1. install npm dependencies
    ```sh
    npm install
    ```
1. build
    ```sh
    npm run build
    ```

## on serve site
1. [install nodejs](https://nodejs.org/en/download/)
1. copy `.build` directory from build site
1. pwd into `.build` folder
1. put custom configuration into `config.user.js`
1. install npm dependencies
    ```sh
    npm install
    ```
1. serve
    ```sh
    npm run serve
    ```

# Deploy with docker

## on build site
1. [install nodejs](https://nodejs.org/en/download/)
1. [install docker](https://docs.docker.com/engine/install/)
1. install npm dependencies
    ```sh
    npm install
    ```
1. login into [docker hub](https://hub.docker.com/)
    ```sh
    docker login
    ```
1. configure image tag
    ```js
    // config.build.user.js
    {
      deploy: {
        docker: {
          imageTag: '<username>/microcosm'
        }
      }
    }
    ```
1. build and publish docker image
    ```sh
    npm run deploy:docker
    ```

## on serve site
1. [install docker](https://docs.docker.com/engine/install/)
1. create folder. eg. `/var/www/microcosm/`
1. put custom configuration into `/var/www/microcosm/config.user.js`
1. pull and run image
    ```sh
    docker container rm -f microcosm
    docker pull <username>/microcosm
    docker run \
            --name microcosm \
            --restart unless-stopped \
            --detach \
            -p 80:80 \
            -v /var/www/microcosm/config.user.js:/opt/project/config.user.js \
            <username>/microcosm
    ```
