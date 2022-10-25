# monitor-api

<p>Build an uptime monitoring RESTful API server that allows authenticated users to monitor URLs, and get detailed uptime reports about their availability, average response time, and total uptime/downtime.</p>

## Overview

- Signup with email verification.
- CRUD operations for URL checks (`GET`, `PUT` and `DELETE` can be called only by the user user who created the check).
- Authenticated users can receive a notification whenever one of their URLs goes down or up again:
  - Email.
- Authenticated users can get detailed uptime reports about their URLs availability, average response time, and total uptime/downtime.
- Authenticated users can group their checks by tags and get reports by tag.

## Technologies

- Nodejs
- Expressjs
- Typescript
- MongoDB

## Requirments

1. [Node & NPM ⬇️](https://nodejs.org/en/) - (node v18), (npm v8)
2. [MongoDB ⬇️](https://www.postgresql.org/download/) - (v14)
3. [Redis ⬇️](https://redis.io/docs/getting-started/installation/)

## Environment Variables

- please see [.env.example](.env.example) file

## Run

```
 npm install
 npm start
```

## Run Test

```
 npm run test
```

## API Routes

```Base URL
http://localhost:7000/api/
```

- `Please note that the request body should be in a JSON formate.`
  &nbsp;

|    Routes     | Method |               Description               |                  Request Body                   |
| :-----------: | :----: | :-------------------------------------: | :---------------------------------------------: |
|               | Users  |
| /users/signup |  POST  |             Register a User             | {name: string, email: string, password: string} |
| /users/login  |  POST  |              Login A user               |        {email:string, password:"string"}        |
|               | Checks |
|    /checks    |  POST  |           create new cron job           |                       {}                        |
|  /checks/:id  | PATCH  |     update check with it's crob job     |                       {}                        |
|  /checks/:id  | DELETE | delete the check url with it's cron job |                       {}                        |
|    /checks    |  GET   |          get the check details          |                                                 |

&nbsp;

### Routes that need a token as shown below :

- All checks endpoints
- All reports endpoints
