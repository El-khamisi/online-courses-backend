# textgenuss-Backend

## Description
A Backend Server ( based on `node.js` and `express` framework) using `MongoDB` as a database provider and `mongoose` as ODM.
textgenuss is an online platform for German language learning the platform has the ability to register new users using `JWT` with different plans of subscription, explore different courses and read articles. The instructor of the platform can add free and paid courses with graded quizzes in addition to publishing premium and free articles for reading. The instructor can manage payments through `Paymob Payment Gateway` which is integrated perfectly with the platform and give the capability to pay, refund, and mentor transactions.


## Features
* Dashboard for platform admin which gives the ability to control courses, lessons, quizzes, and articles.
* Authenticate and authorize users by `JWT token` and initialize `express-session` for each user.
* Store data in `MongoDB` using the `mongoose` ODM.
* Store token in cookies and authenticate the user by custom middleware.
* Upload the media by `Multer` middleware and store them on `Cloudinary`.
* Manage payment transactions by `Paymob Payment Gateway`.

## Installing

* Download the dependencies with `npm` package manager
```
$ npm install
```
## Executing program
* * The website works on `http://localhost:process.env.PORT || 8080` OR by `nodemon` which is run in development mode with monitoring of debugging terminal.

>npm run scripts
```
{
    "scripts": {
        "prettier": "prettier --config .prettierrc 'src/**/*.js' --write",
        "dev": "nodemon index.js 5050",
        "prod": " NODE_ENV=prod node index.js",
        "start": "node index.js"
    }
}
```
## Environment Variables 
> src/config/env.js
```
PORT
DBURI_remote
DBURI
TOKENWORD
NODE_ENV

#cloudinary
cloudinary_name
cloudinary_api_key
cloudinary_api_secret

#paymob
PAYMOB_APIKEY
PAYMOB_integration_id
PAYMOB_HMAC

#exchange price api
exchange_api

#sendinblue email API
sendinblue_user
sendinblue_key
to_email
smtp_host
smtp_port
server_domain

```

## Directory Structure

```
.
|_node_modules/
|_src
|    |_config
|    |_middelwares
|    |_services          #website is divided into small services
|    |    |_model.js
|    |    |_controllers.js            
|    |    |_routes.js
|    |    
|    |_utils
|    |
|    |_index.routes.js
|
|_.env
|_.gitignore
|_index.js
|_package.json
|_README.md
|_LICENSE.md
```
