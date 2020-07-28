import React from 'react';

class NowPlaying extends React.PureComponent {
  constructor() {
    super();

    this.count = 2000;
    this.timer = null;
  }

  componentDidMount() {
    this.props.getNowPlaying();
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

export default NowPlaying;
