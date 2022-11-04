
# What is this project for? #
This project which applies MVC/DDD/Hexagonal structure is using [Express](https://www.npmjs.com/package/express), [MongoDB](https://www.mongodb.com/) and [Mongoose](http://mongoosejs.com/) as ORM. The project has an  implementation of an authentication system that uses JSON Web Token to manage admin' login data in Node.js web server and user management by admin.

## Contents ##
1. [Architecture Overview](#architecture-overview)
  1.1 [Data Layer](#data-layer)
  1.2 [Domain Layer](#domain-layer)
  1.3 [Routs/Controller Layer](#routescontroller-layer)
2. [Security Concern](#security-concern)
  2.1 [JWT signing and verification](#jwt-signing-and-verification)
  2.2 [Password Hashing](#password-hashing)
  2.3 [Username and Email Encryption](#username-and-email-encryption)
3. [Quick Start](#quick-start)
  3.1 [Prerequisites](#prerequisites)
  3.2 [Use Docker](#use-docker)
  3.3 [Use the npm scripts](#use-the-npm-scripts)
4. [Endpoints](#endpoints)
  4.1 [Admin Routes](#admin-routes)
  4.2 [User Routs](#user-routes)
5. [Swagger Docs](#swagger-docs)

6. [Pakages and Tools](#packages-and-tools)

# Architecture Overview #
The app is designed to use a layered architecture. The architecture is heavily influenced by the Clean Architecture.[Clean Architecture](https://8thlight.com/blog/uncle-bob/2012/08/13/the-clean-architecture.html) is an architecture where:

  1. **does not depend on the existence of some framework, database, external agency.**
  2. **does not depend on UI**
  3. **the business rules can be tested without the UI, database, web server, or any external element.** 


Also, in entry point(server.js), I use Dependency Injection(DI). There are many reasons using Dependency Injection as:
1. Decoupling
2. Easier unit testing
3. Faster development
4. Dependency injection is really helpful when it comes to testing. You can easily mock your modules' dependencies using this pattern.


According to DI:
  A. High-level modules should not depend on low-level modules. Both should depend on abstractions.
  B. Abstractions should not depend on details.

The code style being used is based on the airbnb js style guide.


## Data Layer ##

The data layer is implemented using repositories, that hide the underlying data sources (database, network, cache, etc), and provides an abstraction over them so other parts of the application that make use of the repositories, don't care about the origin of the data and are decoupled from the specific implementations used, like the Mongoose ORM that is used by this app. Furthermore, the repositories are responsible to map the entities they fetch from the data sources to the models used in the applications. This is important to enable the decoupling.

## Domain Layer ##

The domain layer is implemented using services. They depend on the repositories to get the app models and apply the business rules on them. They are not coupled to a specific database implementation and can be reused if we add more data sources to the app or even if we change the database for example from MongoDB to Couchbase Server.

## Routes/Controller Layer ##

This layer is being used in the express app and depends on the domain layer (services). Here we define the routes that can be called from outside. The services are always used as the last middleware on the routes and we must not rely on res.locals from express to get data from previous middlewares. That means that the middlewares registered before should not alter data being passed to the domain layer. They are only allowed to act upon the data without modification, like for example validating the data and skipping calling next().

## Entry point ##

The entry point for the applications is the server.js file. It does not depend on express.js or other node.js frameworks. It is responsible for instantiating the application layers, connecting to the db and  mounting the http server to the specified port.

# Security Concern #

## JWT signing and verification ##
As a default, JWT uses HMAC-SHA256 algorithm for signing and verifying. While SHA256 is one of the most popular one, it has security concerns so that it is hardly recommended for a top security application. In this project, RS512 is used for signing and verifying JWT.

### Quick guide ###
Generate a keypair (private key and public key) and save it as private.key and public.key.

private.pem
``` js
-----BEGIN PRIVATE KEY-----
MIIEwAIBADANBgkqhkiG9w0BAQEFAASCBKowggSmAgEAAoIBAQDpLtqxS7OrlD/d
T2tuz4+QNUh2OCa2Bat4bmpY+wL3FdkqIxXUCJX0tfKpCwBikKoQMzddt+ZmoZvj
zIuFv9eploqBJhoL+HYOMzuWCshACn33TZGvx9SYs3aK+vm2cvFRQ6cw5zZJC2v1
2DNM41hblm7c/DK8BaTkPq54hSEu1jOlwH562g10vcivbvjoojL9VSwPAAzt2Gup
IrxTbEUIaVq7iKQ5O2/MOjCcAwcyt8TurUHpZlAMBCUGbFFCzIqWfkMiwq/rFq42
wdGAEApy1TFkbwzhAkjHdLoC6CF3dFkLgJrkB7193wvyaU1gEKtCE5nt1LR/hq3h
quUtxqO3AgMBAAECggEBANX6C+7EA/TADrbcCT7fMuNnMb5iGovPuiDCWc6bUIZC
Q0yac45l7o1nZWzfzpOkIprJFNZoSgIF7NJmQeYTPCjAHwsSVraDYnn3Y4d1D3tM
5XjJcpX2bs1NactxMTLOWUl0JnkGwtbWp1Qq+DBnMw6ghc09lKTbHQvhxSKNL/0U
C+YmCYT5ODmxzLBwkzN5RhxQZNqol/4LYVdji9bS7N/UITw5E6LGDOo/hZHWqJsE
fgrJTPsuCyrYlwrNkgmV2KpRrGz5MpcRM7XHgnqVym+HyD/r9E7MEFdTLEaiiHcm
Ish1usJDEJMFIWkF+rnEoJkQHbqiKlQBcoqSbCmoMWECgYEA/4379mMPF0JJ/EER
4VH7/ZYxjdyphenx2VYCWY/uzT0KbCWQF8KXckuoFrHAIP3EuFn6JNoIbja0NbhI
HGrU29BZkATG8h/xjFy/zPBauxTQmM+yS2T37XtMoXNZNS/ubz2lJXMOapQQiXVR
l/tzzpyWaCe9j0NT7DAU0ZFmDbECgYEA6ZbjkcOs2jwHsOwwfamFm4VpUFxYtED7
9vKzq5d7+Ii1kPKHj5fDnYkZd+mNwNZ02O6OGxh40EDML+i6nOABPg/FmXeVCya9
Vump2Yqr2fAK3xm6QY5KxAjWWq2kVqmdRmICSL2Z9rBzpXmD5o06y9viOwd2bhBo
0wB02416GecCgYEA+S/ZoEa3UFazDeXlKXBn5r2tVEb2hj24NdRINkzC7h23K/z0
pDZ6tlhPbtGkJodMavZRk92GmvF8h2VJ62vAYxamPmhqFW5Qei12WL+FuSZywI7F
q/6oQkkYT9XKBrLWLGJPxlSKmiIGfgKHrUrjgXPutWEK1ccw7f10T2UXvgECgYEA
nXqLa58G7o4gBUgGnQFnwOSdjn7jkoppFCClvp4/BtxrxA+uEsGXMKLYV75OQd6T
IhkaFuxVrtiwj/APt2lRjRym9ALpqX3xkiGvz6ismR46xhQbPM0IXMc0dCeyrnZl
QKkcrxucK/Lj1IBqy0kVhZB1IaSzVBqeAPrCza3AzqsCgYEAvSiEjDvGLIlqoSvK
MHEVe8PBGOZYLcAdq4YiOIBgddoYyRsq5bzHtTQFgYQVK99Cnxo+PQAvzGb+dpjN
/LIEAS2LuuWHGtOrZlwef8ZpCQgrtmp/phXfVi6llcZx4mMm7zYmGhh2AsA9yEQc
acgc4kgDThAjD7VlXad9UHpNMO8=
-----END PRIVATE KEY-----
```

public.key
```
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6S7asUuzq5Q/3U9rbs+P
kDVIdjgmtgWreG5qWPsC9xXZKiMV1AiV9LXyqQsAYpCqEDM3XbfmZqGb48yLhb/X
qZaKgSYaC/h2DjM7lgrIQAp9902Rr8fUmLN2ivr5tnLxUUOnMOc2SQtr9dgzTONY
W5Zu3PwyvAWk5D6ueIUhLtYzpcB+etoNdL3Ir2746KIy/VUsDwAM7dhrqSK8U2xF
CGlau4ikOTtvzDownAMHMrfE7q1B6WZQDAQlBmxRQsyKln5DIsKv6xauNsHRgBAK
ctUxZG8M4QJIx3S6Aughd3RZC4Ca5Ae9fd8L8mlNYBCrQhOZ7dS0f4at4arlLcaj
twIDAQAB
-----END PUBLIC KEY-----
```

Copy these two file to src/configuration directory.

## Password Hashing ##
One of the most secure algorithm ` bcrypt ` was used for password hashing. 

## Username and Email Encryption ##
Before saving these data to database, these are encrypted using AES-256 so that we can ensure the privacy of data.

# Quick start #

### Prerequisites ###

Create an .env file in project root to register the following required environment variables:
  - `DATABASE_URL` - MongoDB connection URL
  - `HTTP_PORT` - port of server
  - `JWT_SECRET` - we will use secret to generate our JSON web tokens

### Use Docker: ###

You can use Docker to start the app locally. The Dockerfile and the docker-compose.yml are already provided for you. You have to run the following command:

```shell
docker-compose up
```

### Use the npm scripts: ###

```shell
npm run start
```
for running project.

```shell
npm run build
```
for building project.

```shell
npm run test
```
for running tests.


# Endpoints #

## Admin Routes ##
  
### Register ###

Register Admin if no admin exists

```shell
POST /admin/register
```

Body Params:
```shell
{ 
  fullname,
  email,
  password
}
```

**Description**: creates a new admin. Password is stored in bcrypt format.


### Login ###

```shell
POST /admin/login
```

Body Params:
```shell
{ 
  email,
  password
}
```

**Description**: logs in to the server. Server will return a JWT token:

```js
{
    "status": "success",
    "data": {
        "token": {
          access_token: "eyJhbGciOiJIUzxxxxxxx.eyJlbWFpbCI6ImRpbW9zdGhlbxxxxxxxxxxxxx.axxxxxxxxxx",
          expiresIn: 86400,
        },
    }
}
```


### Update ###

```shell
PUT /admin/update
```

Body Params:
```shell
{ 
  fullname,
  email,
  password
}
```

**Description**: Update admin info:

```js
{
    "status": "success",
    "data": {
          "id": "635f00db957b63a0db223a67",
          "username": "group.user9",
          "email": "grop.user9@gmail.com",
          "created": "2022-10-30T22:55:23.507Z"
    }
}
```


### Delete ###

```shell
DELETE /admin/
```

**Description**: Delete admin :


## User Routes ##

In order to be able to retrieve posts list, user should send a Bearer token using Authorization header, otherwise server will answer with 401.

### Create user ###

```shell
POST /users/
```

Body Params:
```shell
{ 
  fullname {String},
  email {String},
  password {String}
}
```

**Description**: Create user with Admin's credential.


### Get specific user ###

```shell
GET /users/:userId
```
Response is 
```js
    {
      "data": {
          "id": "635f00db957b63a0db223a67",
          "username": "group.user9",
          "email": "grop.user9@gmail.com",
          "created": "2022-10-30T22:55:23.507Z"
      }
    }
```

**Description**: Gets specific user.

### Get all users ###

```shell
GET /users/all
```

**Description**: Gets all users.

Response is 

```js
    {
      "data": [
          {
            "id": "635f00db957b63a0db223a67",
            "username": "group.user9",
            "email": "grop.user9@gmail.com",
            "created": "2022-10-30T22:55:23.507Z"
          },
      ]
    }
```

### Update a user ###

```shell
PUT /users/:userId
```

Body Params:
```shell
{ 
  fullname {String},
  email {String},
  password {String}
}
```

**Description**: Updatae a specific user with Admin's credential.

### Delete a user ###

```shell
Delete /users/:userId
```

**Description**: Updatae a specific user with Admin's credential.

## Swagger Docs ##

Please visit http://localhost:8080/docs for more details about endpoints.

# Packages and Tools #

  - [Node.js](https://nodejs.org/en/)
  - [Express](https://www.npmjs.com/package/express)
  - [TypeScript](https://www.typescriptlang.org/docs/)
  - [Mongoose](http://mongoosejs.com/)
  - [Mongoose-Pagination](https://github.com/edwardhotchkiss/mongoose-paginate)
  - [Express-jsend](https://www.npmjs.com/package/express-jsend)
  - [Express-validator](https://github.com/ctavan/express-validator)
  - [Bcrypt](https://github.com/dcodeIO/bcrypt.js)
  - [Jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
  - [Jose](https://jose.readthedocs.io/)
  - [Redis](https://github.com/redis/node-redis)
  - [Crypto](https://cryptojs.gitbook.io/)
  - [Eslint](https://www.npmjs.com/package/eslint)


