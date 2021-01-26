import React from 'react';

class Instruction extends React.Component {
    render() {
        return (
            <div className= "text_style">
                <h1 className="center" id="instruction">Instruction of usage </h1>
                <table className="instructionTable">
                    <tbody>
                        <tr className="title">
                            <th>If you are a host</th>
                        </tr>
                        <tr className="info">
                            <td>
                                <div>
                                    <div>Important information as hosts:</div>
                                    <ul>
                                        <li>Hosts are required to have a <a href="https://www.spotify.com/ae-en/premium/">Spotify Premium Account</a>.</li>
                                        <li>Hosts can choose the default playlist to be played when the queue is empty</li>
                                        <li>Hosts MUST close room when they no longer need to use the music room</li>
                                        <li>If you ever forget closing a room, click on "Join Room", our application will tell you all of your open rooms. Join those rooms and close them.</li>
                                    </ul>
                                    <div>Steps to host your own room: </div>
                                    <ul>
                                        <li>Click on "create a room" and log in with your Spotify account.</li>
                                        <li>When you have successfully created a room, play a song on your designated device</li>
                                        <li>If the room correctly displays the song that you are playing, it means that your device is successfully connected.</li>
                                        <li>You have to add a song and click "Play Next" so that your device would start playing songs from Auxify's queue instead of Spotify's local queue</li>
                                        <li>If you ever find your device playing songs not from the queue, click "Play Next" to reconnect.</li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className="instructionTable">
                    <tbody>
                        <tr className="title">
                            <th>If you are an user</th>
                        </tr>
                        <tr className="info">
                            <td>
                                <ul>
                                    <li>You can use the searchbar to add your favorite songs!</li>
                                    <li>Songs with the most upvotes will be played next and so on.</li>
                                    <li>So, let's show your friends your awesome music taste with Auxify!!!</li>
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Instruction;