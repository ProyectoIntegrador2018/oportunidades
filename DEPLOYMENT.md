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