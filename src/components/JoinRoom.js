import React from 'react';
import api from '../api/api.js';

const frontEndRoom = "https://auxify.herokuapp.com/room#room_id=";

class JoinRoom extends React.Component {
    constructor() {
        super();
        this.state = { value: '' };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
            .catch(() => alert("Invalid Room ID"));
    }

    render() {
        return (
            <div className="joinPage center">
                <div className="btn-group fromtop">
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            <input
                                className="searchbar"
                                placeholder="Enter Room ID"
                                type="text"
                                value={this.state.value}
                                onChange={this.handleChange}
                                size="50" />
                        </label>
                        <button type="submit" > Join</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default JoinRoom;