import axios from 'axios';

var baseurl = /*'http://localhost:8888/api'*/'https://auxify-backend.herokuapp.com/api';

const api = axios.create({
    baseURL: baseurl,
})

export const getRoom = id => api.get(`/room/${id}`);
export const addToQueue = (id, payload) => api.post(`/addQueue/${id}`, payload);
export const removeFromQueue = (id) => api.get(`/removeQueue/${id}`);
export const vote = (id, payload) => api.post(`/vote/${id}`, payload);
export const updateDefaultPlaylist = (id, payload) => api.post(`/playlist/${id}`, payload);
export const deleteRoom = (id) => api.get(`/deleteRoom/${id}`);

const apis = {
    getRoom,
    addToQueue,
    removeFromQueue,
    vote,
    updateDefaultPlaylist,
    deleteRoom
}

export default apis