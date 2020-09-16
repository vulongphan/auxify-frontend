import React from 'react';
import server from '../server';
import '../style/App.css'

const backEndLogin = server.backend + '/login';

class CreateRoom extends React.Component {
    render() {
        return (
            <div className="createPage center ">
                <div className="btn-group fromtop">
                    <form action={backEndLogin}>
                        <button type="submit" className="roomAction" > Create a room </button>
                    </form>
                </div>
                <p className="fromtop text_style">You need a Spotify Premium Account to host a new room</p>
                <p className="fromtop text_style">This room will expire after four hours. If you choose to stop using it before it expires, please click on the "Close Room" button</p>
            </div>
        )
    }
}

export default CreateRoom;