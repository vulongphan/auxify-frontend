import React from 'react';
import '../style/Room.css';
import SpotifyWebApi from 'spotify-web-api-js';

import NowPlaying from './NowPlaying';
import Queue from './Queue';
import DefaultPlaylist from './DefaultPlaylist';
import SearchBar from './SearchBar';

const spotifyApi = new SpotifyWebApi();
const PROXY = "http://authentication-auxify.herokuapp.com" /*"http://localhost:8888"*/;
//var xhr = new XMLHttpRequest();

class Room extends React.Component {
    constructor(props) {
        super(props);

        const params = this.getHashParams();

        this.state = {
            room_id: params.room_id,
            info: { name: '', profileImage: '', country: '' },
            nowPlayingState: {
                playing: false,
                currentPosition: 0,
            },
            nowPlayingSong: {
                name: '',
                albumArt: '',
                artists: [],
                duration: 0,
            },
            queue: [],
            vote: [],
            default_playlist: null,
        }

        this.addToQueue = this.addToQueue.bind(this);
        this.removeFromQueue = this.removeFromQueue.bind(this);
        this.play = this.play.bind(this);
        this.updateDefaultPlaylist = this.updateDefaultPlaylist.bind(this);
        this.getNowPlaying = this.getNowPlaying.bind(this);
        this.onVoteUp = this.onVoteUp.bind(this);
        this.onVoteDown = this.onVoteDown.bind(this);
    }

    componentDidMount() {
        //this.getInfo();
        this.getToken()
            .then((response) => {
                if (response.access_token) {
                    spotifyApi.setAccessToken(response.access_token);
                }
            });
        this.onRerender();
        window.addEventListener("beforeunload", this.onRefresh.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener(
            "beforeunload",
            this.onRefresh.bind(this)
        );
        this.onRefresh();
    }

    getToken = async () => { //to get the response from authentication server
        const response = await fetch(PROXY + '/' + this.state.room_id);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        else console.log("Here");
        return body;
    };

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
        var options;
        //if queue is not empty, play from queue;
        if (this.state.queue.length > 0) {
            options = {
                uris: [this.state.queue[0].uri],
            };
            spotifyApi.play(options)
                .then(() => { this.removeFromQueue() },
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
        }
    }

    //update the user's current playback state
    getNowPlaying() {
        spotifyApi.getMyCurrentPlaybackState()
            .then(
                (response) => {
                    if (response.item.name !== this.state.nowPlayingSong.name) {
                        this.setState({
                            nowPlayingState: {
                                playing: true,
                                currentPosition: response.progress_ms,
                            },
                            nowPlayingSong: {
                                name: response.item.name,
                                albumArt: response.item.album.images[0].url,
                                artists: response.item.artists,
                                duration: response.item.duration_ms,
                            }
                        })
                    }
                    else {
                        this.setState({
                            nowPlayingState: {
                                playing: true,
                                currentPosition: response.progress_ms,
                            }
                        })
                    }
                })
            .catch(() => {
                this.setState({
                    nowPlayingState: {
                        playing: false,
                        currentPosition: 0,
                    }
                })
            })
    }

    updateDefaultPlaylist(playlist) {
        this.setState({
            default_playlist: playlist,
        })
    }

    addToQueue(song) {
        var newQueue = this.state.queue.slice();
        var newVote = this.state.vote.slice();
        if (!newQueue.includes(song)) {
            newQueue.push(song);
            newVote.push(0);
            /*
            var data = {
                queue: newQueue,
                vote: newVote,
            }
            xhr.open('POST', 'http://localhost:8888/queue', true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.send(JSON.stringify(data));
            */
            this.setState({
                queue: newQueue,
                vote: newVote,
            });
        }
    }

    swap(arr, i, j) {
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    //update vote and sort the vote array
    onVoteUp(index) {
        var newVote = this.state.vote.slice();
        newVote[index] += 1;
        if (index > 0 && newVote[index] > newVote[index - 1]) {
            this.swap(newVote, index, index - 1);
            var newQueue = this.state.queue.slice();
            this.swap(newQueue, index, index - 1);
            this.setState({
                vote: newVote,
                queue: newQueue,
            });
        } else {
            this.setState({
                vote: newVote,
            });
        }
    }

    onVoteDown(index) {
        if (this.state.vote[index] >= 1) {
            var newVote = this.state.vote.slice();
            newVote[index] -= 1;
            if (index < newVote.length - 1 && newVote[index] < newVote[index + 1]) {
                this.swap(newVote, index, index + 1);
                var newQueue = this.state.queue.slice();
                this.swap(newQueue, index, index + 1);
                this.setState({
                    vote: newVote,
                    queue: newQueue,
                });
            } else {
                this.setState({
                    vote: newVote,
                })
            }
        }
    }

    removeFromQueue() {
        var newQueue = this.state.queue.slice(1);
        var newVote = this.state.vote.slice(1);
        this.setState({
            queue: newQueue,
            vote: newVote,
        });
    }

    getInfo() {
        spotifyApi.getMe()
            .then(
                (response) => {
                    this.setState({
                        info: {
                            name: response.display_name,
                            profileImage: response.images[0].url,
                            country: response.country
                        }
                    })
                }
                , err => console.error(err));
    }

    //fetch the previous state before refresh and update the current state
    onRerender() {
        for (let key in this.state) {
            if (localStorage.hasOwnProperty(key)) {
                let value = localStorage.getItem(key);
                try {
                    value = JSON.parse(value);
                    console.log(key + " " + value);
                    this.setState({ [key]: value });
                } catch (e) {
                    this.setState({ [key]: value });
                }
            }
        }
    }

    //save the current state before refresh
    onRefresh() {
        localStorage.setItem("queue", JSON.stringify(this.state.queue));
        localStorage.setItem("vote", JSON.stringify(this.state.vote));
        localStorage.setItem("default_playlist", JSON.stringify(this.state.default_playlist));
    }

    render() {
        //const isLoggedIn = this.state.loggedIn;
        return (
            <div className='Room'>
                <DefaultPlaylist
                    playlist={this.state.default_playlist}
                    onUpdate={this.play}
                    isPlaying={this.state.nowPlayingState.playing} />
                <SearchBar
                    className="search-playlist"
                    spotifyApi={spotifyApi}
                    onClick={this.updateDefaultPlaylist}
                    types={['playlist']}
                    maxSuggestion={5}
                    placeholder={"Choose a playlist as default"}
                />
                <NowPlaying
                    play={this.play}
                    getNowPlaying={this.getNowPlaying}
                    nowPlayingState={this.state.nowPlayingState}
                    nowPlayingSong={this.state.nowPlayingSong} />
                <Queue
                    queue={this.state.queue}
                    vote={this.state.vote}
                    onVoteUp={this.onVoteUp}
                    onVoteDown={this.onVoteDown}>
                </Queue>
                <SearchBar
                    className="search-track"
                    spotifyApi={spotifyApi}
                    onClick={this.addToQueue}
                    types={['track']}
                    maxSuggestion={10}
                    placeholder={"What song do you want to play?"}
                />
            </div>
        );
    }

}

export default Room;