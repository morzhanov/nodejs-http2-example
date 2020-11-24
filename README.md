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
