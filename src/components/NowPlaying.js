import React from 'react';

class NowPlaying extends React.PureComponent {
  render() {
    const nowPlaying = this.props.nowPlaying;
    if (nowPlaying.playing) { 
      const percentage = +(nowPlaying.currentPosition * 100 / nowPlaying.duration).toFixed(2) + '%';
      return (
        <div className="Room-row2 now-playing">
          <div className="now-playing__text media">
            <div className="media__img">
              <img alt ="" src={nowPlaying.albumArt}  />
            </div>
            <div className="now-playing__bd media__bd">
              <div className="now-playing__track-name text_style">
                {nowPlaying.name}
              </div>
              <div className="now-playing__artist-name text_style">
                {nowPlaying.artists !== undefined && nowPlaying.artists.map(artist => artist.name).join(', ')}
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
        <div className="now-playing Room-row2">Not connected to host's Spotify App</div>
      )
    }
  }
}

export default NowPlaying;