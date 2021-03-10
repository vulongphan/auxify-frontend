// we need to ask for default playlist for morning/midday/dinner - Can use SearchBar component, but for now, just need an url input

import React from 'react';
import SearchBar from './SearchBar';
import api from '../api/api.js';
import '../style/App.css';
import '../style/Room.css';

class RoomSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            options: {
                playlist1: {},
                playlist2: {},
                playlist3: {},
                restriction: null,
            }
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        // make an API call to backend to update a room by first checking if the code matches the room id 
        // ...
    }

    setPlaylistOption(index, item) {
        let playlist = "playlist" + index.toString();
        this.setState({
            options: {
                [playlist]: item
            }
        })
    }

    render() {
        return (
            <div className="RoomSettingsPage center">
                <p className="fromtop text_style"> Please provide the access code you have obtained from us</p>
                <div className="btn-group fromtop">
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            <input
                                className="inputbar"
                                placeholder="Access Code"
                                type="text"
                                value={this.state.value}
                                onChange={this.handleChange}
                                size="50" />
                        </label>
                    </form>
                </div>
                <p className="fromtop text_style"> Morning default playlist </p>
                <SearchBar
                    id="searchPlaylist"
                    className="searchbarPlaylist"
                    spotifyApi={this.props.spotifyApi}
                    onClick={this.addDefaultPlaylist}
                    types={['playlist']}
                    maxSuggestion={5}
                    placeholder={"Choose a playlist as default"}
                />
            </div>
        )
    }
}

export default RoomSettings;