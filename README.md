# Oportunidades Comerciales
Desarrollar una plataforma para recibir oportunidades comerciales y hacercelas llegar a los socios del Cluster de ti de una manera mas automatizada

## Table of contents

* [Client Details](#client-details)
* [Environment URLS](#environment-urls)
* [The Team](#the-team)
* [Technology Stack](#technology-stack)
* [Setup the project](#setup-the-project)


### Client Details

| Name               | Email                   | Role     |
| ------------------ | ----------------------- | -------- |
| Mario Peña         | mario.pena@csoftmty.org | Client  |


### Environment URLS

* **Production** - [Production](http://csoftmty-oportunidades.herokuapp.com/)
* **Development** - [Development](https://oportunidades-comerciales.herokuapp.com/)

### Team February-June 2021

| Name                              | Email              | Role                 |
| --------------------------------- | ------------------ | -------------------- |
| Arturo Arenas Esparza             | a00820982@itesm.mx | SCRUM Master         |
| Ariel Méndez Santillán            | a01020690@itesm.mx | Product Owner Proxy  |
| Martha Cristina Arnaud Pacheco    | a01410560@itesm.mx | Project Administrator|
| Raúl Ernesto Herrera Salinas      | a00820257@itesm.mx | Configuration Administrator|

### Team August-December 2020

| Name                              | Email              | Role                 |
| --------------------------------- | ------------------ | -------------------- |
| José Antonio Alemán Salazar       | a01196565@itesm.mx | Administrator       |
| Mónica Daniela García Aguilar     | a01281919@itesm.mx | Product Owner Proxy |
| Carlos Alejandro Pérez Barrientos | a01282288@itesm.mx | SCRUM Master        |

### Technology Stack
| Technology    | Version      |
| ------------- | -------------|
| ReactJS       | 16.13.1      |
| NodeJS        | 12.18.3      |
| ExpressJS     | 4.x          |

### Management tools

You should ask for access to this tools if you don't have it already:

* [Github repo](https://github.com/ProyectoIntegrador2018/oportunidades)
* [Backlog](https://trello.com/b/a7kksAKp/oportunidades-comerciales)

## Development

### Prerequisites

Before you start, make sure you have **node**, **npm** and **redis** installed in your computer.

#### Install redis in MacOS

run the following commands:

```
brew update
brew install redis
brew services start redis
```

Video tutorial: https://youtu.be/lgWjGkdrExA

#### Install redis in Windows

Navigate to microsoftarchive/redis GitHub repo: https://github.com/microsoftarchive/redis


Go releases and install the latest release by downloading the .msi installer

#### Confirmation of prerequisites

To check this, run the following commands:

```
node -v
npm -v
redis-cli -v
```

### Setup the project

1. Clone the repo into your computer

```bash
$ git clone https://github.com/ProyectoIntegrador2018/oportunidades
```


#### Backend setup

Change to the server directory

```
cd server
```

Install dependencies with:

```
npm install
```

Create a .env file in the root directory. Please replace with your information

* `PORT` : The port where the app runs
* `DATABASE` : The URL of your Mongo Database
* `JWT_KEY` : Super secret key for JWT.
* `AMDIN_EMAIL` : The email of the admin user.
* `ADMIN_PASSWORD` : The password of the admin user.
* `ADMIN_NAME` : The name of the admin user.
* `REDIS_ENV`: Redis environment, either "production" or "development" depending on redis host
* `REDIS_URL`: Redis url which contains host, password and port. Used in redis production env
* `MAIL_ENABLED`: Boolean (true, false) indicating whether notifications should be sent by mail
* `MAIL_USER`: Email address from which notification emails will be sent.
* `MAIL_PASSWORD`: Email password for the specified mail at MAIL_USER.
* `MAIL_SERVICE`: gmail (for CSOFTMTY MAL_SERVICE provider is Gmail)
* `REDIS_PORT`: Local redis port number, usually 6379
* `REDIS_HOST`: Local redis host api number, usually 127.0.0.1
* `REDIS_DB`: Local redis database number, usually 0


Start the server backend

```
npm run dev
```

#### Frontend Setup

Switch to the client directory

```
cd client
```

Install dependencies

```
npm install
````

Run the frontend

```
npm run start
```

Your browser should automatically open the front end running.
