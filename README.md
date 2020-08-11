### How to deply the app to Heroku
To fix the H10 error, add "heroku-postbuild": "npm run build" to "scripts" in package.json file , then run "yarn add serve --save" to add the 'serve' command to the dependencies, then change "start": "serve -s build", 
    "dev": "react-scripts start",

Post to Heroku:
1. Change baseurl in api/api
2. Change links in CreateRoom.js, JoinRoom.js, Room.js

### How to run the app locally
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
