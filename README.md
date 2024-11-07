<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

Built with the [Nest](https://github.com/nestjs/nest) framework besides microservices archticture and graphql.

NestJS | @NestJS/Microservices | Typescript | Mongodb | Mongoose | GraphQL | Zod | JWT | Bcrypt | Docker

services:

- 1st: the core service that has the core functionality and act as a gateway for other services
- 2nd: the users service, containes everything that has to deal with the user like managing and authenticating users

Pure ExpressJS version of this project can be found at [github](https://github.com/Amer-Zakaria/e-commerce-api#readme)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# Core service
$ npm run start:core

# Users service
$ npm run start:users
```

Add `.env` to the root of the folder 
```bash
NODE_ENV="production"
nodeTest_JwtPrivateKey=

#user client
CLIENT_USER_HOST=localhost
CLIENT_USER_PORT=3001
CLIENT_USER_HTTP_PORT=4001

#data bases
MONGODB_E_COMMERCE_CORE_URI=
MONGODB_USERS_URI=
```
## Run examples in Postman
  - Sign in to Postman 
  - Fork the following [workspace](https://www.postman.com/spaceflight-astronomer-43511803/workspace/nest/collection/17012877-0ab9957c-b478-4b0d-b136-d3d8d9e5ba91?action=share&creator=17012877)
  - Add those to environment variables to the workspace (in order to grant access to protected routes)
      - PRODUCT_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzJjOTI4NGU0MjM4MjIxZmFjMTYzNWYiLCJuYW1lIjoiUHJvZHVjdCBNYW5hZ2VyIiwiZW1haWwiOiJwcm9kdWN0bWFuYWdlckBnbWFpbC5jb20iLCJwZXJtaXNzaW9ucyI6WyJDUkVBVEVfUFJPRFVDVCIsIlVQREFURV9QUk9EVUNUIiwiQUNUSVZBVEVfUFJPRFVDVCJdLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNzMwOTc4Mzk5fQ.Y4z1NEU9aujitnD1366b_faoznS6e5y09uCcUf1Txbg
      - ADMIN_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzJjOTMwNmU0MjM4MjIxZmFjMTYzNjQiLCJuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInBlcm1pc3Npb25zIjpbXSwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNzMwOTc4NjE4fQ.nqI__4WS1H-yBslnK5Q6aTvIYixEg5oa-lCbasg1AYo
  - Send your first request to the `/health` route (1st request takes about 1min to resolve -_-)
