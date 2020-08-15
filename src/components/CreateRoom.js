import React from 'react';
import '../style/App.css'

const backEndLogin = "https://auxify-backend.herokuapp.com";

class CreateRoom extends React.Component {
    render() {
        return (
            <div className="createPage center ">
                <div className = "btn-group fromtop">
                    <button>
                        <a href={backEndLogin}> Create a room </a>
                    </button>
                </div>

                <p className="fromtop text_style">You need a Spotify Premium account to host a new room</p>
            </div>
        )
    }
}

export default CreateRoom;