import React from 'react';

class RoomInfo extends React.Component {
    render() {
        const hostInfo = this.props.hostInfo;
        return (
            <div className="room-info media text_style highlight">
                <div className="media__img">
                    <img src={hostInfo.profileImage} />
                </div>
                <div className="media__bd">
                    <p>Room ID: {this.props.room_id}</p>
                    <p>Hosted by: {hostInfo.name}</p>
                </div>
                <DefaultPlaylist playlist={this.props.playlist} />
            </div>
        )
    }
}

const DefaultPlaylist = (props) => {
    const playlist = props.playlist;
    if (playlist) {
        return (
            <div className="display-playlist">
                <span>
                    <img src={playlist.images[0].url} width="20px" height="20px" />
                    <span className="display-playlist__name"> {playlist.name}</span>
                    <span className="display-playlist__owner"> by {playlist.owner.display_name}</span>
                </span>
            </div>
        )
    } else {
        return (
            <div className="display-playlist">N/A</div>
        )
    }
}


export default RoomInfo;