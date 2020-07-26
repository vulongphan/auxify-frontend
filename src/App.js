import React, { Fragment } from 'react';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

function LogIn(props) {
  const isLoggedIn = props.loggedIn;
  const info = props.info;
  if (!isLoggedIn) {
    return (
      <button className="login">
        <a href="http://authentication-auxify.herokuapp.com/login"> Login to Spotify </a>
      </button>
    );
  }
  return (
    <div className="media-body">
      <img src={info.profileImage} type="width: 100%"></img>
      <h1 className="name">{info.name}</h1>
      <p className="country">{info.country}</p>
    </div>
  )
}

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

          //console.log(result);

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

class QueueItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const songInfo = this.props.songInfo;
    return (
      <tr>
        <td>
          <img src={songInfo.image} width="30" height="30" />
        </td>
        <td> {songInfo.name}</td>
        <td> - {songInfo.artists.map(artist => artist.name).join(', ')}</td>
        <td>
          <button onClick={() => this.props.onVoteUp(this.props.index)}>upvote</button>
        </td>
        <td>
          <button onClick={() => this.props.onVoteDown(this.props.index)}>downvote</button>
        </td>
        <td>
          {this.props.vote}
        </td>
      </tr>
    );
  }
}

class Queue extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    const queue = this.props.queue;
    const vote = this.props.vote;

    return (
      <div className="queue-container">
        <div>Queue</div>
        <table>
          <tbody id="queue">
            {queue.map((song, index) => {
              var songInfo = {
                image: song.album.images[2].url,
                name: song.name,
                artists: song.artists,
              };
              return (
                <QueueItem
                  key={song.id}
                  index={index}
                  vote={vote[index]}
                  songInfo={songInfo}
                  onVoteUp={this.props.onVoteUp}
                  onVoteDown={this.props.onVoteDown} />
              )
            })}
          </tbody>
        </table>
        <Search
          className="search-track"
          onClick={this.props.addToQueue}
          types={['track']}
          maxSuggestion={10}
          placeholder={"What song do you want to play?"}
        ></Search>
      </div>
    )
  }
}

class NowPlaying extends React.PureComponent {
  constructor() {
    super();

    this.count = 2000;
    this.timer = null;
  }

  componentDidMount() {
    this.timer = setInterval(this.props.getNowPlaying, this.count);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  componentDidUpdate() {
    const left = this.props.nowPlayingSong.duration - this.props.nowPlayingState.currentPosition;
    if (left <= this.count) this.props.play();
  }

  render() {
    if (this.props.nowPlayingState.playing) {
      const nowPlaying = this.props.nowPlayingSong;
      const percentage = +(this.props.nowPlayingState.currentPosition * 100 / nowPlaying.duration).toFixed(2) + '%';
      return (
        <div className="now-playing">
          <div className="now-playing__text media">
            <div className="media__img">
              <img src={nowPlaying.albumArt} width="170" height="170" />
            </div>
            <div className="now-playing__bd media__bd">
              <div className="now-playing__track-name">
                {nowPlaying.name}
              </div>
              <div className="now-playing__artist-name">
                {nowPlaying.artists.map(a => a.name).join(', ')}
              </div>
            </div>
          </div>
          <div className="now-playing__progress">
            <div className="now-playing__progress_bar" style={{ width: percentage }} />
          </div>
        </div>
      );
    } else {
      return (
        <div className="now-playing">Currently not online</div>
      )
    }
  }
}

class DefaultPlaylist extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    if (!this.props.isPlaying) this.props.onUpdate();
  }

  render() {
    const playlist = this.props.playlist;
    return (
      <div className="container">
        {playlist &&
          <div className="display-playlist">
            <p>The default playlist is </p>
            <span>
              <img src={playlist.images[0].url} width="20px" height="20px" />
              <span> {playlist.name}</span>
              <span> by {playlist.owner.display_name}</span>
            </span>
          </div>}
        <Search
          className="search-playlist"
          onClick={this.props.updateDefaultPlaylist}
          types={['playlist']}
          maxSuggestion={5}
          placeholder={"Choose a playlist as default"}
        />
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    const params = this.getHashParams();
    const token = params.access_token;

    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
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

  hide() {
    document.getElementById("after-log-in").style.visibility = "hidden";
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

  play() {
    if (this.state.queue.length > 0) {
      var options = {
        uris: [this.state.queue[0].uri],
      };
      console.log(options);
      spotifyApi.play(options)
        .then(() => { this.removeFromQueue() },
          err => {
            if (err.status === 404) alert("Check if your device is online or logged in");
          });
    }
    else if (this.state.default_playlist) {
      var options = {
        context_uri: this.state.default_playlist.uri,
      }
      console.log(options);
      spotifyApi.play(options)
        .catch(err => console.log(err));
    }
    else {
      console.log(this.state.default_playlist);
    }
  }

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
    }
    this.setState({
      queue: newQueue,
      vote: newVote,
    });
  }

  swap(arr, i, j) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

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

/*
getDevice() {
  spotifyApi.getMyDevices()
    .then(
      (response) => {
        this.setState({
          devices: response.devices[0].id,
        })
      }
    )
    .catch(err => console.error(err));
}
*/

componentDidMount() {
  const isLoggedIn = this.state.loggedIn;
  if (!isLoggedIn) {
    this.hide();
  } else {
    this.getInfo();
    //this.getDevice();
  }
}

render() {
  const isLoggedIn = this.state.loggedIn;
  return (
    <div className='App'>
      <div className="Log-in">
        <LogIn
          loggedIn={isLoggedIn}
          info={this.state.info} />
      </div>
      <div id="after-log-in">
        <DefaultPlaylist
          playlist={this.state.default_playlist}
          updateDefaultPlaylist={this.updateDefaultPlaylist}
          onUpdate={this.play}
          isPlaying={this.state.nowPlayingState.playing} />
        <NowPlaying
          play={this.play}
          getNowPlaying={this.getNowPlaying}
          nowPlayingState={this.state.nowPlayingState}
          nowPlayingSong={this.state.nowPlayingSong} />
        <Queue
          queue={this.state.queue}
          vote={this.state.vote}
          addToQueue={this.addToQueue}
          onVoteUp={this.onVoteUp}
          onVoteDown={this.onVoteDown}>
        </Queue>
      </div>
    </div>
  );
}

}

export default App;
