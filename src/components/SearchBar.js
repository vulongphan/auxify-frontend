import React from 'react';

function Suggestion(props) {
    if (props.types.includes("track")) { //search bar for track
        const searchResult = props.searchResult.song; //list of search results
        //console.log("index of song to pick: " + this.props.index);
        return (
            <ul className="suggestionList">
                {searchResult.map((song, index) => {
                    //call func
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
    } else { //search bar for playlist
        const searchResult = props.searchResult.playlist;

        return (
            <ul className="suggestionList">
                {searchResult.map((playlist) => {
                    return (
                        <li className="suggestionItem" key={playlist.id} onClick={() => { props.onClick(playlist); props.clearSearch() }}>
                            <div>
                                <span>
                                    <img alt="" src={playlist.images[0].url} height="20px" width="20px" />
                                    <span> {playlist.name}</span>
                                    <span> by {playlist.owner.display_name}</span>
                                </span>
                            </div>
                        </li>
                    );
                })}
            </ul>
        )
    }
}


class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchResult: { song: [], playlist: [] },
            index: -1,
        }

        this.clearSearch = this.clearSearch.bind(this);
        this.search = this.search.bind(this);
        this.findIndex = this.findIndex.bind(this);
    }

    search(query) {
        if (query) {
            const types = this.props.types;
            const spotifyApi = this.props.spotifyApi;
            spotifyApi.search(query, types)
                .then((response) => {
                    var result;
                    if (types.includes("track")) {
                        result = response.tracks.items;
                        if (result.length > this.props.maxSuggestion) {
                            result = result.slice(0, this.props.maxSuggestion);
                        }
                        this.setState({
                            searchResult: { song: result }
                        });
                    }
                    if (types.includes("playlist")) {
                        result = response.playlists.items;
                        if (result.length > this.props.maxSuggestion) {
                            result = result.slice(0, this.props.maxSuggestion);
                        }
                        this.setState({
                            searchResult: { playlist: result }
                        });
                    }
                })
                .catch(err => console.log(err));
        } else this.clearSearch();
    }

    clearSearch() {
        document.getElementById(this.props.id).value = '';
        this.setState({
            searchResult: { song: [], playlist: [] },
            index: -1,
        });
    }

    findIndex(event, type) { //rerender SearchBar and its child elements if ArrowDown and ArrowUp are pressed
        var key = event.key;
        if (type === "track") {
            if (key === "ArrowDown") {
                var i = this.state.index;
                if (i < this.state.searchResult.song.length - 1) {
                    this.setState({
                        index: i + 1,
                    })
                }
                else {
                    this.setState({
                        index: 0,
                    })
                }
            }
            else if (key === "ArrowUp") {
                var i = this.state.index;
                if (i >= 1) {
                    this.setState({ index: i - 1 });
                }
                else {
                    this.setState({ index: this.state.searchResult.song.length - 1 })
                }
            }
        }

        //check the last item in the suggestion list


        else if (key == "Enter" && this.state.index >= 0) {
            var song = this.state.searchResult.song[this.state.index]; //the song that the user picks
            this.props.onClick(song);
            this.clearSearch();


        }

    }

    render() {
        return (
            <div className={this.props.className}>
                <input
                    id={this.props.id}
                    onKeyUp={event => { this.search(event.target.value) }}
                    onKeyDown={event => this.findIndex(event, this.props.types[0])}
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