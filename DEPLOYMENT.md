### Prerequisites

Before you start, make sure you have **heroku cli** and **git** installed in your computer.

## Create new app in Heroku

Login into your Heroku account, click on New > New App. Give it a name.

## Setup environment variables in your app

Go to settings and then go to the environment variables section to add the following:

* `DATABASE` : The URL of your Mongo Production Database
* `JWT_KEY` : Super secret key for JWT.
* `ADMIN_EMAIL` = The system administrator email. This is the email the System Admin will use to login into the system.
* `ADMIN_PASSWORD` = The system administrator password. This password can be changed once the system admin logins into the system.
* `ADMIN_NAME` = The system administrator name.


## Login to Heroku in your terminal

```
$ heroku login
```
This will open up a tab in your browser for you to login into your Heroku account. 


## Setup the project for deployment

1. Clone the repo into your computer

```bash
$ git clone https://github.com/ProyectoIntegrador2018/oportunidades
```

### Move into the project
```
$ cd oportunidades
```

### Add the created Heroku app to your repo
Replace `<your-app-name>` with your app's name
```
$ heroku git:remote -a <your-app-name> 
```

#### Deploy to Heroku

```
$ git push heroku master
```

Once it's done, your app will be deployed. Check on your Heroku Dashboard to see the url for your app.
