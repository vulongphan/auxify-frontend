import React from 'react';

function About(){
    return (
        <div className = "text_style">
            <div className = "instruction center ">
            <h1>Instruction of usage</h1> 
            <p>In this web application, you can choose to host a listening room or to join one with the room id.</p>  
            <p>To host a listening room, you need a <a href = "https://www.spotify.com/ae-en/premium/">Spotify Premium Account</a>.</p>
            <p>In a listening room, you can search for songs and add it to the queue. You can either like, dislike, or report a song (these actions can be undone) and songs with the most likes will be played first in the queue.</p>  
            <p>The host can choose a default playlist to be played if there are no songs in the queue.</p>
            <p>Also, the host's Spotify App must be playing in order for it to be connected to the listening room.</p>  
            <br></br>
            </div>
            <div className = "developed_by center">
            <h1>Developed by</h1> 
            <p><a href = "https://hdo.netlify.app/">Hieu Do</a></p>   
            <p><a href = "https://vulongphan.netlify.app/">Long Phan</a></p>
            </div>
        </div>
    )
}

export default About;