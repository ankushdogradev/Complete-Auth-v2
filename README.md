# Complete-Auth-v2 

Complete Authentication & Authorization

## Features



## Screenshots




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

- []() for clientID.
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas/register) for mongo URI.

6. In the root folder create **.env** file
7. Make sure to update the .env path in [**server.js**](server/server.js). Replace `<YOUR_PATH>` & `<PROJECT_NAME>` accordingly:
```
require("dotenv").config({
  path: "<YOUR_PATH>/<PROJECT_NAME>/.env",
});
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NODE_ENV = development`

`PORT = 5000`

`MONGO_URI = "your mongodb uri: REMOVE DOUBLE QUOTES"`

`JWT_SECRET = "any string of your choice: REMOVE DOUBLE QUOTES "`

`PAYPAL_CLIENT_ID = "your paypal client id: REMOVE DOUBLE QUOTES"`


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
