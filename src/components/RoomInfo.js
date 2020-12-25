import React from 'react';

class RoomInfo extends React.Component {
    render() {
        const hostInfo = this.props.hostInfo;
        return (
            <div className="room-info media text_style highlight">
                <div className="media__img">
                    <img alt="" src={hostInfo.profileImage} />
                </div>
                <div className="media__bd">
                    <div className="room_header">
                        <span id = "room_id" >
                            Room ID: {this.props.room_id}
                        </span>
                    </div>
                    <div className="host">
                        <p>Hosted by: {hostInfo.name}</p>
                    </div>
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
                    <span>Playlist: </span>
                    <span className="display-playlist__name"> {playlist.name}</span>
                </span>
            </div>
        )
    }
    else {
        return (
            <div className="display-playlist"></div>
        )
    }
}


export default RoomInfo;