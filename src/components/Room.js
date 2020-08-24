import React from 'react';
import '../style/Room.css';
import SpotifyWebApi from 'spotify-web-api-js';
import api from '../api/api.js';

import NowPlaying from './NowPlaying';
import Queue from './Queue';
import SearchBar from './SearchBar';
import RoomInfo from './RoomInfo';

const spotifyApi = new SpotifyWebApi();
const expired = 'http://localhost:3000/expire' /*"https://auxify.herokuapp.com/expire"*/;

class Room extends React.Component {
    constructor(props) {
        super(props);

        const params = this.getHashParams();

        this.state = {
            room_id: params.room_id,
            hostInfo: {},
            queue: [],
            default_playlist: null,
        }

        this.count = 500;

        this.addToQueue = this.addToQueue.bind(this);
        this.play = this.play.bind(this);
        this.updateDefaultPlaylist = this.updateDefaultPlaylist.bind(this);
    }

    componentDidMount() {
        this.timer = setInterval(() => this.fetchRoom(this.state.room_id), this.count);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    fetchRoom(room_id) {
        api.getRoom(room_id)
            .then(res => { //the returned Promise in successful case is stored in res parameter
                if (res.data.success) {
                    const room = res.data.data;
                    //console.log("Current access_token: " + room.access_token);

                    const current_time = Date.now();
                    const duration = 3600 * 1000; //lifetime for an access_token in the room (in mili sec)
                    //console.log("end_time at: "+ room.end_time);
                    //console.log("Now is: " + current_time);
                    if (current_time >= room.end_time && current_time < room.end_time + this.count) {
                        console.log("Pass end_time");
                        //make sure we only request access_token once when the current access_token expires
                        //request new access_token from refresh_token 
                        api.requestToken(room.refresh_token).then(access_token => {
                            console.log("New access_token: " + access_token);
                            //update the access_token and end_time of room
                            api.updateToken(room_id, {access_token: access_token});
                            api.updateEndtime(room_id, {end_time: current_time + duration});
                        }
                        );
                    }
                    spotifyApi.setAccessToken(room.access_token);
                    this.getInfo();
                    this.setState({
                        queue: room.queue,
                        default_playlist: room.default_playlist,
                    })

                }
            })
            .catch(() => { window.location.href = expired });


    }

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

    //only works if user starts playing a song first to get device
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
                options = {
                    context_uri: this.state.default_playlist.uri,
                }
                spotifyApi.play(options)
                    .catch(err => console.log(err));
            } else {
                alert("Add songs to queue or a default playlist");
            }
        }
    }

    //update the user's current playback state
    updateDefaultPlaylist(playlist) {
        const payload = { default_playlist: playlist }
        api.updateDefaultPlaylist(this.state.room_id, payload)
            .then(() => console.log("Successfully updated"))
            .catch(err => console.log(err));
    }

    addToQueue(song) {
        song.vote = 0;
        api.addToQueue(this.state.room_id, song)
            .then(() => console.log("Successfully added"))
            .catch(err => console.log(err));
    }

    getInfo() {
        spotifyApi.getMe()
            .then(
                (response) => {
                    this.setState({
                        hostInfo: {
                            name: response.display_name,
                            profileImage: response.images[0].url
                        }
                    })
                }
                , err => console.error(err));
    }

    render() {
        return (
            <div className='Room ColumnFlex'>
                <div className='Room-row1 RowFlex'>
                    <RoomInfo
                        hostInfo={this.state.hostInfo}
                        room_id={this.state.room_id}
                        playlist={this.state.default_playlist} />
                    <SearchBar
                        id="searchPlaylist"
                        className="searchbarPlaylist"
                        spotifyApi={spotifyApi}
                        onClick={this.updateDefaultPlaylist}
                        types={['playlist']}
                        maxSuggestion={5}
                        placeholder={"Choose a playlist as default"} />
                </div>
                <NowPlaying
                    play={this.play}
                    spotifyApi={spotifyApi} />
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
                        room_id={this.state.room_id} />
                </div>
            </div>
        );
    }

}

export default Room;