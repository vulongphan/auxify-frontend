import axios from 'axios';

var baseurl = 'http://auxify-backend.herokuapp.com/api';

const api = axios.create({
    baseURL: baseurl,
})

var request = require('request');

export const getRoom = id => api.get(`/room/${id}`);
export const addToQueue = (id, payload) => api.post(`/addQueue/${id}`, payload);
export const removeFromQueue = (id) => api.get(`/removeQueue/${id}`);
export const vote = (id, payload) => api.post(`/vote/${id}`, payload);
export const updateDefaultPlaylist = (id, payload) => api.post(`/playlist/${id}`, payload);
export const deleteRoom = (id) => api.get(`/deleteRoom/${id}`);
export const updateToken = (id, payload) => api.post(`/updateToken/${id}`, payload);

export const requestToken = async (refresh_token) => {
    let client_id = '4a8772300cb64c018d48cc371bd223c0'; // Your client id
    let client_secret = 'bb776306a7e74c79b96810016215ffeb'; // Your secret
    let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };
    function doRequest(options) {
        return new Promise(function (resolve, reject) { //we need to return a Promise because we want to wait for the access_token to be returned
            request.post(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    resolve(body.access_token);
                } else {
                    reject(error);
                }
            });
        });
    }
    let access_token = await doRequest(authOptions); //the resolved Promise (that is, value of access_token) is stored here, the requestToken() pauses here until the Promise is resolved/rejected
    console.log("post request success");
    return access_token;
};

export const updateEndtime = (id, payload) => api.post(`/updateEndtime/${id}`, payload);

const apis = {
    getRoom,
    addToQueue,
    removeFromQueue,
    vote,
    updateDefaultPlaylist,
    deleteRoom,
    requestToken,
    updateToken,
    updateEndtime,
}

export default apis