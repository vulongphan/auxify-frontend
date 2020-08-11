import React from 'react';

const backEndLogin = "https://auxify-backend.herokuapp.com/login"/*"http://localhost:8888/login"*/;

class CreateRoom extends React.Component {
    render() {
        return (
            <div>
                <button className="login">
                    <a href={backEndLogin}> Create a room </a>
                </button>
                <p>Log in to your Spotify Account and host a new room</p>
            </div>
        )
    }
}

export default CreateRoom;