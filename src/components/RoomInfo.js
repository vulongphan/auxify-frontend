import React from 'react';

class RoomInfo extends React.Component{
    render(){
        const hostInfo = this.props.hostInfo;
        return(
            <div className="room-info media">
                <div className="room-info media__img">
                <img src={hostInfo.profileImage} width="170" height="170" />
                </div>
                <div className="room-info media__bd">
                    <p>Room ID: {this.props.room_id}</p>
                    <p>Hosted by: {hostInfo.name}</p>
                </div>
            </div>
        )
    }
}


export default RoomInfo;