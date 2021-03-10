import React from 'react';
import {server_url} from '../config';
import '../style/App.css'

const backEndLoginPersonal = server_url + '/login/0';
const backendLoginInstitutional = server_url + '/login/1';

class CreateRoom extends React.Component {
    // hasAccessCode() {
    //     let answer = window.confirm("You need an access code to create an institutional room. Have you got one?");
    //     if 
    // }
    render() {
        return (
            <div className="createPage center ">
                <div className="btn-group fromtop">
                    <form action={backEndLoginPersonal}>
                        <button type="submit" className="roomAction" > Create a personal room </button>
                    </form>
                </div>
                {/* <p className="fromtop text_style">You need a Spotify Premium Account to host a new room</p> */}
                <p className="fromtop text_style">A personal listening room will last four hours unless you close it</p>
                <div className="btn-group frombottom">
                    <form action={backendLoginInstitutional}>
                        <button type="submit" className="roomAction" onClick = {() => alert ("You need to register for an access code to create an institutional room")}> Create an institutional room </button>
                        <p className="fromtop text_style">An institutional listening room can last forever unless you close it</p>
                    </form>
                </div>
            </div>
        )
    }
}

export default CreateRoom;