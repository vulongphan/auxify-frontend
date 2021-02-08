import React from 'react';
import '../style/Room.css';
import SpotifyWebApi from 'spotify-web-api-js';
import { client_url } from '../config';
import api from '../api/api.js';
import defaultImg from '../style/default.jpg';

import NowPlaying from './NowPlaying';
import Queue from './Queue';
import SearchBar from './SearchBar';
import RoomInfo from './RoomInfo';
import apis from '../api/api.js';

const spotifyApi = new SpotifyWebApi();
const expired = client_url + '/expire';

class Room extends React.Component {
    constructor() {
        super();

        const params = this.getHashParams();

        this.state = {
            room_id: params.room_id,
            hostInfo: {},
            queue: [],
            user_votes: {},
            default_playlist: null,
            nowPlaying: {
                playing: false,
                currentPosition: 0,
                name: null,
                albumArt: null,
                artists: null,
                duration: 0,
            },
            is_host: null
        }

        this.count = 500;

        this.addToQueue = this.addToQueue.bind(this);
        this.play = this.play.bind(this);
        this.updateDefaultPlaylist = this.updateDefaultPlaylist.bind(this);

        this.setCookie = this.setCookie.bind(this);
        this.getCookie = this.getCookie.bind(this);
        this.handleHost = this.handleHost.bind(this);
        this.deleteRoomHandler = this.deleteRoomHandler.bind(this);
        this.updateSongCookie = this.updateSongCookie.bind(this);
    }

    componentDidMount() {
        this.timer = setInterval(() => this.fetchRoom(this.state.room_id), this.count);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    /**
     * Fetch the room info and update room state 
     * @param {String} room_id
     */
    fetchRoom(room_id) {
        api.getRoom(room_id)
            .then(res => {
                if (res.data.success) {
                    const room = res.data.data;

                    this.handleHost(room.host_known);

                    let user_votes = this.updateSongCookie(room.id);

                    spotifyApi.setAccessToken(room.access_token);

                    if (this.state.hostInfo !== {}) this.getInfo();
                    this.setState({
                        queue: room.queue,
                        default_playlist: room.default_playlist,
                        nowPlaying: room.nowPlaying,
                        user_votes: user_votes,
                    })
                    console.log(this.state.user_votes);
                }
            })
            //when room expires, direct to Expire component
            .catch(() => {
                // window.location.href = expired;
            });
    }

    /**
     * Get the parameter from the url
     */
    getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        e = r.exec(q)
        while (e) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
            e = r.exec(q);
        }
        return hashParams;
    }

    /**
     * Update the user's current playback state
     * @param {*} playlist: playlist info in json
     */
    updateDefaultPlaylist(playlist) {
        const payload = { default_playlist: playlist }
        api.updateDefaultPlaylist(this.state.room_id, payload)
            .then(() => console.log("Successfully updated"))
            .catch(err => console.log(err));
    }

    addToQueue(song) {
        song.vote = 0;
        song.report = 0;
        api.addToQueue(this.state.room_id, song)
            .then(() => console.log("Successfully added"))
            .catch(err => console.log(err));
    }

    /**
     * Update user info, called in fetchRoom
     */
    getInfo() {
        spotifyApi.getMe()
            .then(
                (response) => {
                    if (response.images.length > 0) {
                        this.setState({
                            hostInfo: {
                                name: response.display_name,
                                profileImage: response.images[0].url
                            }
                        })
                    } else {
                        this.setState({
                            hostInfo: {
                                name: response.display_name,
                                profileImage: defaultImg
                            }
                        })
                    }
                }
                , err => console.error(err));
    }

    /**
     * Play the next song when users click the play next button
     */
    play() {
        if (spotifyApi.getAccessToken()) {
            var options;
            //if queue is not empty, play from queue;
            if (this.state.queue.length > 0) {
                options = {
                    uris: [this.state.queue[0].uri],
                };
                spotifyApi.play(options)
                    .then(() => { api.removeFromQueue(this.state.room_id) },
                        err => {
                            console.log(err);
                        });
            }
            //if queue is empty, play from default playlist;
            else if (this.state.default_playlist) {
                spotifyApi.getPlaylist(this.state.default_playlist.id)
                    .then(res => {
                        const playlist = res.tracks.items;
                        var position = Math.floor(Math.random() * playlist.length);
                        console.log(position);
                        var nextSongURI = playlist[position].track.uri;
                        options = {
                            uris: [nextSongURI],
                        };
                        spotifyApi.play(options)
                            .catch(err => console.log(err));
                    });
            } else {
                alert("Add songs to queue or a default playlist");
            }
        }
    }

    /**
     * Update cookie that corresponds to a song in a room
     */
    updateSongCookie(room_id) {
        let votes_prv = {};
        // get all the cookies that corresponds to songs in the room: room_id + "_" + song_id + "=" + vote
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') { // stripping whitespace
                c = c.substring(1);
            }
            if (c.indexOf(room_id) === 0) { //if the cookie corresponds to a song in the room
                let song_cookie = c.substring(0, c.length - 2);
                let vote = parseInt(c.substring(c.length - 1));
                votes_prv[song_cookie] = vote;
            }
        }
        // get all the song_ids in the current queue
        let votes_cur = {};
        for (let i = 0; i < this.state.queue.length; i++) {
            let song_id = this.state.queue[i].id;
            let song_cookie = room_id + "_" + song_id;
            votes_cur[song_cookie] = 0;
        }
        // check for new songs and delete songs that are no longer in queue
        let votes = {};
        let entries_cur = Object.keys(votes_cur); // an array of song_ids in current queue
        for (let i = 0; i < entries_cur.length; i++) {
            let song_cookie = entries_cur[i];
            if (votes_prv[song_cookie] !== undefined) { // if song_ids in current queue are already saved in cookies
                votes[song_cookie] = votes_prv[song_cookie];
                delete votes_prv[song_cookie];
            }
            else { // new songs
                votes[song_cookie] = 0;
                this.setCookie(song_cookie, 0);
            }
        }
        let entries_prv = Object.keys(votes_prv); // an array of song_ids no longer in queue
        for (let i = 0; i < entries_prv; i++) {
            this.setCookie(entries_prv[i], "", 1 / 3600); // delete the corresponding cookie of songs that no are no longer in queue
        }
        return votes;
    }

    /**
     * Get cookie from cookie's name
     * @param {String} cname: cookie name 
     * @returns {String}: if found the cookie, return the cookie; else return an empty string
     */
    getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') { // stripping whitespace
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) { //if the given cookie name is found, return the value of the cookie
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    /**
     * Set a cookie
     * @param {String} cname: name of the cookie 
     * @param {String} cvalue: value of the cookie
     * @param {number} exhrs: time expired (in hours) - not setting the expire time for now
     * 
     */
    setCookie(cname, cvalue, exhrs) {
        if (exhrs !== undefined) {
            console.log("expire time for cookie is set");
            var d = new Date();
            d.setTime(d.getTime() + (exhrs * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }
        else document.cookie = cname + "=" + cvalue;
    }

    /**
     * Differentiate host's browser using cookie
     * @param {boolean} host_known: 
     */
    handleHost(host_known) {
        const cname = "host" + this.state.room_id;
        const cvalue = this.getCookie(cname);
        if (cvalue === "") { // set cookie if cookie not found
            this.setCookie(cname, host_known, 4)
        }
        // if this is the host's browser then update the value of host_known 
        // so that subsequent browsers are not hosts
        if (host_known === true) api.updateHost(this.state.room_id, { host_known: false });
        this.setState(
            {
                is_host: JSON.parse(this.getCookie(cname)) //true or false
            }
        )
    }

    /**
     * Delete cookie that corresponds to the room when the host wants to close the room
     */
    deleteRoomHandler() {
        //cookie name that corresponds to the room being hosted
        const cname = "host" + this.state.room_id;
        //alert user of the msg to close Room
        var answer = window.confirm("Are you sure that you want to close this room ?");
        if (answer === true) {
            api.deleteRoom(this.state.room_id);
            //we also have to set the corresponding cookie to be empty and expires in 1 sec
            //note that only the cookie value is deleted but the cookie name still exists (i.e: hostABCD=)
            this.setCookie(cname, "", 1 / 3600);
            console.log("cookie deleted");
        }
        else { //to prevent the window from reloading after pressing Cancel button
            return false
        }
    }

    render() {
        return (
            <div className="RoomPage">
                <div className='Room ColumnFlex'>
                    <div className='Room-row1 RowFlex'>
                        <RoomInfo
                            hostInfo={this.state.hostInfo}
                            room_id={this.state.room_id}
                            playlist={this.state.default_playlist} />
                        {this.state.is_host &&
                            <SearchBar
                                id="searchPlaylist"
                                className="searchbarPlaylist"
                                spotifyApi={spotifyApi}
                                onClick={this.updateDefaultPlaylist}
                                types={['playlist']}
                                maxSuggestion={5}
                                placeholder={"Choose a playlist as default"} />}

                    </div>
                    <NowPlaying
                        spotifyApi={spotifyApi}
                        room_id={this.state.room_id}
                        nowPlaying={this.state.nowPlaying} />
                    <div className='Room-row3 RowFlexReverse'>
                        <SearchBar
                            id="searchTrack"
                            className="searchbarTrack"
                            spotifyApi={spotifyApi}
                            onClick={this.addToQueue}
                            types={['track']}
                            maxSuggestion={10}
                            placeholder={"What song do you want to play?"}
                        />
                        <Queue
                            queue={this.state.queue}
                            room_id={this.state.room_id}
                            is_host={this.state.is_host}
                            play={this.play}
                            user_votes={this.state.user_votes} />
                    </div>
                </div>
                {this.state.is_host &&
                    <div className="btn-group fromtop">
                        <form onSubmit={this.deleteRoomHandler}>
                            <button type="submit" className="roomAction" > CLOSE ROOM </button>
                        </form>
                    </div>}

            </div>
        )
    }
}

export default Room;