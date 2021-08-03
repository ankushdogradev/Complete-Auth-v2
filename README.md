# Complete-Auth-v2 

Complete Authentication & Authorization

## Features
- SignUp/SignIn
- Email Confirmation
- Login with Facebook
- Login with Google
- Password reset with email
- Role based redirects (admin or user)
- Storing JWT in Cookie & user data on localstorage.


## Screenshots
![Screenshot 2021-08-03 at 18-19-34 Complete Auth](https://user-images.githubusercontent.com/75878788/128020975-851d69f2-d514-464a-ac48-0487d6a8175d.png)
![Screenshot 2021-08-03 at 18-19-53 Complete Auth](https://user-images.githubusercontent.com/75878788/128020986-1e5bc052-172c-428f-98b3-6d3893fe33e2.png)




## Tech Stack

**Client:** React, Redux, Router, SCSS

**Server:** Node, Express, Mongoose

  
## Installation

1. Fork/clone or download project.
2. Make sure you have Node.js, NPM installed in your system
3. In the root folder type following commands:

```bash
npm i
```

```bash
cd client
```

```bash
npm i
```

4. It is not necessary but recommended to install nodemon globally by `npm i -g nodemon`
5. You need to create following accounts:

- [Google Cloud Platform](https://console.cloud.google.com/projectselector2/apis/dashboard?authuser=1&organizationId=0&supportedpurview=project&project=&folder=) for google login.
- [Facebook Developer](https://developers.facebook.com/) for facebook login.

-(Optional: if you are using MongoDB locally ignore it)

 [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas/register) for mongo URI.

-(OPTIONAL: Only if you are using sendgrid for Email)

 [SendGrid](https://sendgrid.com/) for sendgrid api key.

6. Create two **.env** files one in project root folder & other in the client directories root folder. like this:

![image](https://user-images.githubusercontent.com/75878788/128022735-5f135c3b-3a86-434a-b120-a924f54d6cea.png)

7. Make sure to update the .env path in [**server.js**](server/server.js). Replace `<YOUR_PATH>` & `<PROJECT_NAME>` accordingly:
```
require("dotenv").config({
  path: "<YOUR_PATH>/<PROJECT_NAME>/.env",
});
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

**PROJECT ROOT DIRECTORY ENV**

`NODE_ENV = development`

`CLIENT_URL = "your client url: REMOVE DOUBLE QUOTES" `

`PORT = 5000`

`MONGO_URI = "your mongodb uri: REMOVE DOUBLE QUOTES"`

`EMAIL_TO = "recipient : REMOVE DOUBLE QUOTES"`

`EMAIL_FROM = "sender : REMOVE DOUBLE QUOTES"`

`SENDGRID_API_KEY = "your sendgrid apikey : REMOVE DOUBLE QUOTES"`

`JWT_SECRET = "random string : REMOVE DOUBLE QUOTES "`

`JWT_EXPIRE = "expire time : REMOVE DOUBLE QUOTES" `

`JWT_ACTIVATION_SECRET = "random string : REMOVE DOUBLE QUOTES"`

`JWT_ACTIVATION_EXPIRE = "expire time : REMOVE DOUBLE QUOTES"`

`JWT_RESET_PASSWORD_SECRET = "randm string : REMOVE DOUBLE QUOTES"`

`JWT_RESET_PASSWORD_EXPIRE = " expire time : REMOVE DOUBLE QUOTES"`

`GOOGLE_CLIENT_ID = "your google client id : REMOVE DOUBLE QUOTES"`

**CLIENT ROOT DIRECTORY ENV**

`REACT_APP_GOOGLE_CLIENT_ID = 'your google client id' `

`REACT_APP_FACEBOOK_APP_ID = 'your facebook app id'`

## Run Locally

To run the project locally, open CLI in **server** folder and **client** folder:

- In server CLI enter `nodemon server.js`
- In client CLI enter `npm start`


## Deploying To Heroku
- Heroku postbuild script is added to **package.json**. No, need to build manually. 
- Just install heroku and push. 

## License

MIT License

Copyright (c) [2021] [Ankush Dogra]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
