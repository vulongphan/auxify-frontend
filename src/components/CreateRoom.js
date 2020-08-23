import React from 'react';
import '../style/App.css'

const backEndLogin = "http://auxify-backend.herokuapp.com/login";

class CreateRoom extends React.Component {
    render() {
        return (
            <div className="createPage center ">
                <div className="btn-group fromtop">
                    <form action={backEndLogin}>
                        <button type="submit" className = "roomAction" > Create a room </button>
                    </form>
                </div>

                <p className="fromtop text_style">You need a Spotify Premium Account to host a new room</p>
                <p className="fromtop text_style">We recommend that you host a room by using your computer or laptop </p>

            </div>
        )
    }
}

export default CreateRoom;