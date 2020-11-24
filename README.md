# nodejs-http2-example

Simple NodeJS HTTP2 server example (using core http2 module)

## To start app run

```bash
npm run start
```

Application accepts connections on 127.0.0.1:8000

## Description

Example Users CRUD app using NodeJS `http2` module.

Endpoints:

- `POST /users` - create a user
- `GET /users` - get all users
- `GET /users/{userId}` = get a single user
- `DELETE /users/{userId}` - delete user
- `PUT /users/{userId}` - update user

Also, this example contains simple Static Server and HTTP2 Server Push example.

## Performing requests

In order to perform request create `client_cert.pem` and `client_key.pem`.
To perform request run:

```bash
curl -v --http2 \
    --cert ./client_cert.pem \
    --key ./client_key.pem \
    --pass <pass phrase> \
    -k \
    https://localhost:8443
```

### General Request

```bash
curl -v --http2 \
    --cert ./client_cert.pem \
    --key ./client_key.pem \
    --pass <pass phrase> \
    -k \
    https://localhost:8443/index.html
```

### Server Push Request

```bash
curl -v --http2 \
    --cert ./client_cert.pem \
    --key ./client_key.pem \
    --pass <pass phrase> \
    -k \
    https://localhost:8443/push.html
```

### CRUD Request

#### GET all

```bash
curl -v --http2 \
    --cert ./client_cert.pem \
    --key ./client_key.pem \
    --pass <pass phrase> \
    -k \
    https://localhost:8443/users
```

#### GET one

```bash
curl -v --http2 \
    --cert ./client_cert.pem \
    --key ./client_key.pem \
    --pass <pass phrase> \
    -k \
    https://localhost:8443/users/<user-id>
```

#### POST create one

```bash
curl -v --http2 \
    --cert ./client_cert.pem \
    --key ./client_key.pem \
    --pass <pass phrase> \
    -k \
    -X POST \
    -d '{"id": "some-id", "name": "some-name"}' \
    https://localhost:8443/users
```

#### DELETE one

```bash
curl -v --http2 \
    --cert ./client_cert.pem \
    --key ./client_key.pem \
    --pass <pass phrase> \
    -k \
    -X DELETE \
    https://localhost:8443/users/<user-id>
```

#### PUT update one

```bash
curl -v --http2 \
    --cert ./client_cert.pem \
    --key ./client_key.pem \
    --pass <pass phrase> \
    -k \
    -X POST \
    -d '{"id": "some-id", "name": "some-name"}' \
    https://localhost:8443/users/<user-id>
```

## TLS

In order to run server we should create `cert.crt` and `key.key` files and put those files under `./src/tls/` folder
