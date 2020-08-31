import React from 'react';
import DefaultPic from '../style/default.jpg';

function DisplayImage(props) {
    if (props.image) {
        return (
            <div className="media__img">
                <img alt="" src={props.image} />
            </div>
        )
    } else {
        return (
            <div className="media__img">
                <img alt="" src={DefaultPic} />
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
                    {/* <img src={playlist.images[0].url} width="20px" height="20px" /> */}
                    <span className="display-playlist__name"> {playlist.name}</span>
                    <span className="display-playlist__owner"> by {playlist.owner.display_name}</span>
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

class RoomInfo extends React.Component {
    render() {
        const hostInfo = this.props.hostInfo;
        return (
            <div className="room-info media text_style highlight">
                <DisplayImage image={hostInfo.profileImage} />
                <div className="media__bd">
                    <div className="room_id">
                        <span>Room ID: {this.props.room_id}</span>
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

export default RoomInfo;