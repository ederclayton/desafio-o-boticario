# Challenge Boticário Group

The ideia is create a Cashback system, where the amount will be made available as a credit for the next purchase from the dealership in Boticário. This API Rest was made using NodeJS and MongoDB.

```
OBS: This software is part of a programming test, so everything that has been implemented is fictionalized.
```

## Prerequisites

- [Node.js](https://nodejs.org) version 10.14 or higher

    ```bash
    # determine node version
    node --version
    ```

- [MongoDB](https://www.mongodb.com/) version 4.2

## To execute this code

- Clone the repository

    ```bash
    git clone https://github.com/ederclayton/desafio-o-boticario.git
    ```

- Install modules

    ```bash
    npm install
    ```

- Start the project

    ```bash
    npm start
    ```

## To execute the tests

- Execute all tests (unit tests and integration tests)

    ```bash
    npm test
    ```

- Execute unit tests

    ```bash
    npm run test_unit
    ```

- Execute integration tests

    ```bash
    npm run test_int
    ```

## Routes explanation

### Route POST /reseller

#### Description

- This route is responsible for registering a new reseller. For this, the user must pass some information in json format.

#### Parameters

```json
{
    "name": "Teste Testando da Silva",
    "cpf": "12345678910",
    "email": "test@test.com",
    "password": "123456789"
}
```

### Route POST /login

#### Description

- This route is responsible for a reseller logged in and get access to others routes. For this, the user must pass some information in json format.

#### Parameters

```json
{
    "cpf": "12345678910",
    "password": "123456789"
}
```

### Route POST /purchase

#### Description

- This route is responsible for saving a purchase made by a reseller logged in to recover cashback.

#### Parameters

```json
{
    "code": "123",
    "value": 1000.0
}
```

### Route GET /purchases

#### Description

- This route is used so that the reseller has access to all his registered purchases. This way, the reseller can check if his cashback is still under evaluation or has already been accounted for.

#### Parameters

- No parameters are required.

### Route GET /cashback

#### Description

- This route is used for resellers to check their cashback balance.

#### Parameters

- No parameters are required.