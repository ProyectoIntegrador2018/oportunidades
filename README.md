# Oportunidades Comerciales
Desarrollar una plataforma para recibir oportunidades comerciales y hacercelas llegar a los socios del Cluster de ti de una manera mas automatizada

## Table of contents

- [Oportunidades Comerciales](#oportunidades-comerciales)
  - [Table of contents](#table-of-contents)
    - [Client Details](#client-details)
    - [Environment URLS](#environment-urls)
    - [Previous Team](#previous-team)
    - [Technology Stack](#technology-stack)
    - [Management tools](#management-tools)
  - [Development](#development)
    - [Prerequisites](#prerequisites)
    - [Setup the project](#setup-the-project)
      - [Backend setup](#backend-setup)
      - [Frontend Setup](#frontend-setup)


### Client Details

| Name               | Email                   | Role     |
| ------------------ | ----------------------- | -------- |
| Mario Peña         | mario.pena@csoftmty.org | Client  |


### Environment URLS

* **Production** - [Production](http://csoftmty-oportunidades.herokuapp.com/)
* **Development** - [Development](https://oportunidades-comerciales.herokuapp.com/)

### Previous Team

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

Before you start, make sure you have **node** and **npm** installed in your computer.

To check this, run the following commands:

```
node -v
npm -v
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

Create a .env file in the root directory. In this repo you will find a .env.config file, please feel free to copy its contents into
your .env file. Please replace with your information

* `PORT` : The port where the app runs
* `DATABASE` : The URL of your Mongo Database
* `JWT_KEY` : Super secret key for JWT.
* `AMDIN_EMAIL` : The email of the admin user.
* `ADMIN_PASSWORD` : The password of the admin user.
* `ADMIN_NAME` : The name of the admin user.

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
