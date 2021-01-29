import axios from 'axios';
import {server_url, spotify_id, spotify_secret} from '../config';

var baseurl = server_url + '/api';

const api = axios.create({
    baseURL: baseurl,
})

export const getRoom = id => api.get(`/room/${id}`);
export const addToQueue = (id, payload) => api.post(`/addQueue/${id}`, payload);
export const vote = (id, payload) => api.post(`/vote/${id}`, payload);
export const report = (id, payload) => api.post(`/report/${id}`, payload);
export const removeFromQueue = (id) => api.get(`/removeQueue/${id}`);
export const updateDefaultPlaylist = (id, payload) => api.post(`/playlist/${id}`, payload);
export const deleteRoom = (id) => api.get(`/deleteRoom/${id}`);
export const updateToken = (id, payload) => api.post(`/updateToken/${id}`, payload);
export const updateHost = (id, payload) => api.post(`/updateHost/${id}`, payload);

const apis = {
    getRoom,
    addToQueue,
    vote,
    report,
    updateDefaultPlaylist,
    deleteRoom,
    updateToken,
    updateHost,
    removeFromQueue,
}

export default apis