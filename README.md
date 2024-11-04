<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

Built with the [nest](https://github.com/nestjs/nest) framework besides microservices archticture and graphql.

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
