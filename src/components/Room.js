import React from 'react';
import '../style/Room.css';
import SpotifyWebApi from 'spotify-web-api-js';

import NowPlaying from './NowPlaying';
import Queue from './Queue';
import DefaultPlaylist from './DefaultPlaylist';

const spotifyApi = new SpotifyWebApi();
//var xhr = new XMLHttpRequest();

class Suggestion extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.types.includes("track")) {
            const searchResult = this.props.searchResult.song;

            return (
                <ul className="suggestionList">
                    {searchResult.map((song) => {
                        return (
                            <li key={song.id} onClick={() => { this.props.onClick(song); this.props.clearSearch() }}>
                                <div>
                                    <span>
                                        <img src={song.album.images[2].url} height="20px" width="20px" />
                                        <span> {song.name}</span>
                                        <span> - {song.artists[0].name}</span>
                                    </span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            );
        } else {
            const searchResult = this.props.searchResult.playlist;

            return (
                <ul className="suggestionList">
                    {searchResult.map((playlist) => {
                        return (
                            <li key={playlist.id} onClick={() => { this.props.onClick(playlist); this.props.clearSearch() }}>
                                <div>
                                    <span>
                                        <img src={playlist.images[0].url} height="20px" width="20px" />
                                        <span> {playlist.name}</span>
                                        <span> by {playlist.owner.display_name}</span>
                                    </span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )
        }
    }
}

class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchResult: { song: [], playlist: [] },
        }

        this.clearSearch = this.clearSearch.bind(this);
        this.search = this.search.bind(this);
    }

    search(query) {
        if (query) {
            const types = this.props.types;
            spotifyApi.search(query, types)
                .then((response) => {
                    var result;
                    if (types.includes("track")) {
                        result = response.tracks.items;
                        if (result.length > this.props.maxSuggestion) {
                            result = result.slice(0, this.props.maxSuggestion);
                        }
                        this.setState({
                            searchResult: { song: result }
                        });
                    }
                    if (types.includes("playlist")) {
                        result = response.playlists.items;
                        if (result.length > this.props.maxSuggestion) {
                            result = result.slice(0, this.props.maxSuggestion);
                        }
                        this.setState({
                            searchResult: { playlist: result }
                        });
                    }
                })
                .catch(err => console.log(err));
        } else this.clearSearch();
    }

    clearSearch() {
        this.setState({
            searchResult: { song: [], playlist: [] },
        });
    }

    render() {
        return (
            <div>
                <input
                    className="searchbar"
                    onKeyUp={event => { this.search(event.target.value) }}
                    placeholder={this.props.placeholder}
                    type="text"
                    size="50"
                />
                <Suggestion
                    searchResult={this.state.searchResult}
                    types={this.props.types}
                    onClick={this.props.onClick}
                    clearSearch={this.clearSearch}>
                </Suggestion>
            </div>
        );
    }
}

class Room extends React.Component {
    constructor(props) {
        super(props);

        const params = this.getHashParams();
        
        /*
        const token = params.access_token;

        if (token) {
            spotifyApi.setAccessToken(token);
        }
        */

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
        const response = await fetch('http://authentication-auxify.herokuapp.com/' + this.state.room_id);
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
        //if queue is not empty, play from queue;
        if (this.state.queue.length > 0) {
            var options = {
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
            var options = {
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
            var data = {
                queue: newQueue,
                vote: newVote,
            }
            /*
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
                <Search
                    className="search-playlist"
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
                <Search
                    className="search-track"
                    onClick={this.addToQueue}
                    types={['track']}
                    maxSuggestion={10}
                    placeholder={"What song do you want to play?"}
                ></Search>
            </div>
        );
    }

}

export default Room;