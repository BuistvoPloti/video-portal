To run inside a docker follow:

    docker build -t <name> .
    docker-compose build
    docker-compose up

Make sure to set .env variables(in root),
basic *essential* variables:

    NODE_ENV='dev'
    SERVER_PORT='8081'
    DOCKER_DB_PORT='5432'
    DEV_DB_URL='postgres://postgres:postgres@postgres:5432/postgres'

    
