import React from 'react';

class NowPlaying extends React.PureComponent {
  constructor(props) {
    super(props);

    this.count = 2000;
    this.timer = null;

    this.state = {
      playing: false,
      currentPosition: 0,
      name: '',
      albumArt: '',
      artists: [],
      duration: 0,
    }

    this.getNowPlaying = this.getNowPlaying.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(this.getNowPlaying, this.count);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  componentDidUpdate() {
    const left = this.state.duration - this.state.currentPosition;
    if (this.state.playing && left <= this.count) {
      this.props.play();
    }
  }

  getNowPlaying() {
    this.props.spotifyApi.getMyCurrentPlaybackState()
      .then(
        (response) => {
          if (response.item.name !== this.state.name) {
            this.setState({
              playing: true,
              currentPosition: response.progress_ms,
              name: response.item.name,
              albumArt: response.item.album.images[0].url,
              artists: response.item.artists,
              duration: response.item.duration_ms,
            })
          }
          else {
            this.setState({
              playing: true,
              currentPosition: response.progress_ms,
            })
          }
        })
      .catch(() => {
        this.setState({
          playing: false,
          currentPosition: 0,
        })
      })
  }

  render() {
    if (this.state.playing) {
      const percentage = +(this.state.currentPosition * 100 / this.state.duration).toFixed(2) + '%';
      return (
        <div className="Room-row2 now-playing">
          <div className="now-playing__text media">
            <div className="media__img">
              <img src={this.state.albumArt}  />
            </div>
            <div className="now-playing__bd media__bd">
              <div className="now-playing__track-name text_style">
                {this.state.name}
              </div>
              <div className="now-playing__artist-name text_style">
                {this.state.artists.map(a => a.name).join(', ')}
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
        <div className="now-playing Room-row2">Play a song on your device for Auxify to connect with it</div>
      )
    }
  }
}

export default NowPlaying;