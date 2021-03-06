import React from 'react';

/**
 * Load top 10 suggestions based on search
 * @param {*} props 
 */
function Suggestion(props) {
    const searchResult = props.searchResult;
    //if the player is searching for a song track
    if (props.types.includes("track")) { 
        return (
            <ul className="suggestionList">
                {searchResult.map((song, index) => {
                    if (index !== props.index) {
                        return ( //show the song that the user has the pick at
                            <li className="suggestionItem" key={song.id} onClick={() => { props.onClick(song); props.clearSearch() }}>
                                <div>
                                    <span>
                                        {song.album.images.length >= 3 &&
                                            <img alt="" src={song.album.images[2].url} height="20px" width="20px" />}
                                        <span className="text_style"> {song.name}</span>
                                        <span className="text_style"> - {song.artists[0].name}</span>
                                    </span>
                                </div>
                            </li>
                        );
                    }
                    else {
                        return (
                            <li className="suggestionItem suggestionItemAt" key={song.id} onClick={() => { props.onClick(song); props.clearSearch() }}>
                                <div>
                                    <span>
                                        {song.album.images.length >= 3 &&
                                            <img alt="" src={song.album.images[2].url} height="20px" width="20px" />}
                                        <span className="text_style"> {song.name}</span>
                                        <span className="text_style"> - {song.artists[0].name}</span>
                                    </span>
                                </div>
                            </li>
                        )
                    }
                })}
            </ul>
        );
    }
    // if the user is searching for a playlist 
    else {
        return (
            <ul className="suggestionList">
                {searchResult.map((playlist, index) => {
                    if (index !== props.index) {
                        return (
                            <li className="suggestionItem" key={playlist.id} onClick={() => { props.onClick(playlist); props.clearSearch() }}>
                                <div>
                                    <span>
                                        {playlist.images.length > 0 &&
                                            <img alt="" src={playlist.images[0].url} height="20px" width="20px" />}
                                        <span className="text_style"> {playlist.name}</span>
                                        <span className="text_style"> by {playlist.owner.display_name}</span>
                                    </span>
                                </div>
                            </li>
                        )
                    } else {
                        return (
                            <li className="suggestionItem suggestionItemAt" key={playlist.id} onClick={() => { props.onClick(playlist); props.clearSearch() }}>
                                <div>
                                    <span>
                                        {playlist.images.length > 0 &&
                                            <img alt="" src={playlist.images[0].url} height="20px" width="20px" />}
                                        <span className="text_style"> {playlist.name}</span>
                                        <span className="text_style"> by {playlist.owner.display_name}</span>
                                    </span>
                                </div>
                            </li>
                        )
                    }
                })}
            </ul>
        )
    }
}


class SearchBar extends React.Component {
    constructor() {
        super();
        
        this.state = {
            searchResult: [],
            index: -1,
        }

        this.clearSearch = this.clearSearch.bind(this);
        this.search = this.search.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    /**
     * Search for songs/playlist based on string query
     * @param {String} query 
     */
    search(query) {
        // if the user is typing, then search for something
        if (query) {
            const types = this.props.types;
            const spotifyApi = this.props.spotifyApi;
            spotifyApi.search(query, types)
                .then((response) => {
                    var result;
                    //filter out explicit songs
                    if (types.includes("track")){
                        result = response.tracks.items;
                        let i = 0;
                        while (i < result.length) {
                            if (result[i].explicit !== undefined && result[i].explicit) {
                                result.splice(i,1);
                            }
                            else i+=1
                        }
                    } 
                    else if (types.includes("playlist")) {
                        result = response.playlists.items;

                    }
                    if (result.length > this.props.maxSuggestion) {
                        result = result.slice(0, this.props.maxSuggestion);
                    }
                    this.setState({
                        searchResult: result,
                    });
                })
                .catch(err => console.log(err));
        }
        // if the user is not typing, then clear the search
        else this.clearSearch();
    }

    /**
     * Clear the search result state 
     */
    clearSearch() {
        document.getElementById(this.props.id).value = '';
        this.setState({
            searchResult: [],
            index: -1,
        });
    }

    /**
     * Rerender SearchBar and its child elements if ArrowDown and ArrowUp are pressed
     * @param {*} event 
     */
    onKeyDown(event) { 
        var key = event.key;
        var i = this.state.index;
        if (key === "ArrowDown") {
            if (i < this.state.searchResult.length - 1) this.setState({ index: i + 1 })
            else this.setState({ index: 0 })
        }
        else if (key === "ArrowUp") {
            if (i >= 1) this.setState({ index: i - 1 })
            else this.setState({ index: this.state.searchResult.length - 1 })
        }
        else if (key === "Enter" && this.state.index >= 0) {
            var song = this.state.searchResult[this.state.index]; //the song that the user picks
            this.props.onClick(song);
            this.clearSearch();
        }
    }

    render() {
        return (
            <div className={this.props.className}>
                <input
                    id={this.props.id}
                    onKeyUp={event => this.search(event.target.value)}
                    onKeyDown={event => this.onKeyDown(event)}
                    placeholder={this.props.placeholder}
                    type="text"
                    style={{ width: "100%" }}
                />
                <Suggestion
                    searchResult={this.state.searchResult}
                    types={this.props.types}
                    onClick={this.props.onClick}
                    clearSearch={this.clearSearch}
                    index={this.state.index} //index of the song after ArrowDown and ArrowUp keys are pressed
                >
                </Suggestion>
            </div>
        );
    }
}

export default SearchBar;