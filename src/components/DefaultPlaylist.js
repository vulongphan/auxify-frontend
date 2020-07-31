import React from 'react';

class DefaultPlaylist extends React.Component {
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
      </div>
    )
  }
}

export default DefaultPlaylist;
