import React from 'react';
import api from '../api/api.js';
import server from '../server';
import '../style/App.css'

const frontEndRoom = server.frontend + '/room#room_id=';

class JoinRoom extends React.Component {
    constructor() {
        super();
        this.state = {
            value: '',
            rooms: [], //each object in this list contains the room id and boolean value to tell whether is the host 
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.checkRoom = this.checkRoom.bind(this);
    }

    componentDidMount() {
        this.checkRoom(); //check for the rooms that have been created by the host every time the page is reloaded
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        api.getRoom(this.state.value)
            .then(() => {
                window.location.href = frontEndRoom + this.state.value;
            })
            .catch(() => alert("Invalid Room Id or No Internet Connection"));
    }

    checkRoom() {
        //we need to do, in order: get the cookies list and then the elements with substring "host" (an element is "hostABCD=true" or "hostABCD=false")
        //for each of these elements, get all the room ids and boolean value to tell whether it is the host of the room
        var rooms = [];
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') { //take out any whitespace
                c = c.substring(1);
            };
            if (c.indexOf("host") === 0) { // we find the appropriate cookie
                var room = {};
                var room_id = c.substring(4, 8); //the room id we are looking for (why 4 and 8: "hostABCD=false")
                room["id"] = room_id;
                var bool = JSON.parse(c.substring(9, c.length)); // a boolean value to tell if this is the host
                room["is_host"] = bool;
                rooms.push(room);
            }
        }
        this.setState({
            rooms: rooms,
        })
    }

    render() {
        return (
            <div className="joinPage center">
                <div className="btn-group fromtop">
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            <input
                                className="searchbarId"
                                placeholder="Enter Room ID"
                                type="text"
                                value={this.state.value}
                                onChange={this.handleChange}
                                size="50" />
                        </label>
                        <button type="submit" id="join_room" > Join</button>
                    </form>
                </div>
                <div className="frombottom text_style">
                    <span>Rooms that you are hosting: </span>
                    {this.state.rooms.map(room => {
                        var id = room["id"];
                        var is_host = room["is_host"]
                        if (is_host === true) { //if that is the host then return the room_id
                            return (
                                <span>{id} </span>
                            )
                        }
                    })}
                </div>
            </div>
        )
    }
}

export default JoinRoom;