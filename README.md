# babybet
Webapp to bet on babies gender, size, weight, birthday, ...

- Nextjs
- express server
- mongodb database

test the app on [beta.babybet.de](https://beta.babybet.de)

## Road to release

- Add birth time as bet option
- add e-mail field to bet
  - send user his/her bet
  - add possibility to edit bet with one time email password
- a date for last chance to bet
- Own babybet icon

## Development guide
This is monorepo with api server and frontend separated as `api`and `api`.
In order to start development here follow the following steps
- fork and clone the repo
- from project folder run `$ yarn install`, this will install the require dependencies for the `api` and `app` project. As it is using yarn workspace , no need to run it separate for each project.
- in order to start the frontend(app) development server, from `app` folder, run `$ npm run next:start`. It will run the `nextjs` wrapper script along with the server running script
- in order to start development on `api`, run `$ node api` from your root folder or can use `nodemon` if you want hot reloading for the server. 

### Guide for mongodb connection

Please make sure to run the local instance of `mongodb` in order to work with local database and pass `MONGO_USER`, `MONGO_PASSWORD`, `MONGO_SERVER` and `MONGO_DB_NAME` as environment variable to the script for running the server.

- eg `$ MONGO_USER=root MONGO_PASSWORD=''  MONGO_SERVER=locahost:4949 MONGO_DB_NAME=babybet  node api`.

Use [`cross-env`](https://www.npmjs.com/package/cross-env) for making common npm scripts for different OS


Start working on the `pages` and `components` for making changes in the frontend and `server.js` for making changes in the app server. 
To make changes in the API, start working on the `api/index.js`.

*Happy Hacking :+1:*
