const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  client_url : process.env.REACT_APP_CLIENT_URL,
  server_url : process.env.REACT_APP_SERVER_URL,
  spotify_id : process.env.REACT_APP_SPOTIFY_ID,
  spotify_secret: process.env.REACT_APP_SPOTIFY_SECRET
};