import React from 'react';

function Suggestion(props) {
    if (props.types.includes("track")) {
        const searchResult = props.searchResult.song;

        return (
            <ul className="suggestionList">
                {searchResult.map((song) => {
                    return (
                        <li className="suggestionItem" key={song.id} onClick={() => {props.onClick(song); props.clearSearch() }}>
                            <div>
                                <span>
                                    <img src={song.album.images[2].url} height="20px" width="20px" />
                                    <span> {song.name}</span>
                                    <span> - {song.artists[0].name}</span>
                                </span>
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    } else {
        const searchResult = props.searchResult.playlist;

        return (
            <ul className="suggestionList">
                {searchResult.map((playlist) => {
                    return (
                        <li className="suggestionItem" key={playlist.id} onClick={() => {props.onClick(playlist); props.clearSearch() }}>
                            <div>
                                <span>
                                    <img src={playlist.images[0].url} height="20px" width="20px" />
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
        }

        this.clearSearch = this.clearSearch.bind(this);
        this.search = this.search.bind(this);
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
        });
    }

    render() {
        return (
            <div className = {this.props.className}>
                <input
                    id={this.props.id}
                    onKeyUp={event => { this.search(event.target.value) }}
                    placeholder={this.props.placeholder}
                    type="text"
                    style={{width: "100%"}}
                />
                <Suggestion
                    searchResult={this.state.searchResult}
                    types={this.props.types}
                    onClick={this.props.onClick}
                    clearSearch={this.clearSearch}>
                </Suggestion>
            </div>
        );
    }
}

export default SearchBar;