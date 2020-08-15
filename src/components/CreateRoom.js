import React from 'react';
import '../style/App.css'

const backEndLogin = "https://auxify-backend.herokuapp.com/login"/*"http://localhost:8888/login"*/;

class CreateRoom extends React.Component {
    render() {
        return (
            <div className="createPage center ">
                <div className="btn-group fromtop">
                    <form action={backEndLogin}>
                        <button type="submit" > Create a room </button>
                    </form>
                </div>

                <p className="fromtop text_style">You need a Spotify Premium account to host a new room</p>
            </div>
        )
    }
}

export default CreateRoom;