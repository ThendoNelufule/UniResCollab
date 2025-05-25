# install this before anything:
 npm init -y

## install the following dependecies:

   "bcrypt": "^5.1.1",
    "dotenv": "^16.5.0",
    "ejs": "^3.1.10",
    "express": "^5.1.0",
    "express-ejs-layouts": "^2.5.1",
    "express-flash": "^0.0.2",
    "express-session": "^1.18.1",
    "method-override": "^3.0.0",
    "mongoose": "^8.15.0",
    "multer": "^1.4.5-lts.2",
    "passport": "^0.7.0",
    "passport-github2": "^0.1.12",
    "passport-google-oauth20": "^2.0.0",
    "socket.io": "^4.8.1"

Create .env file in the root of UniResCollab folder

Get the KEY variables in the file I uploaded on MOODLE and paste them on .env file

Go to BackEnd folder -> Passport:
   - In googleStrategy.js, replace the callbackUrl with this link : http://localhost:4000/auth/google/callback
   - In githubStrategy.js, replace the callbackUrl with this link : http://localhost:4000/auth/github/callback
