import React from 'react';

function About(){
    return (
        <div className = "text_style">
            <div className = "instruction center ">
            <h1 >Instruction of usage </h1> 
            <p>In this web application, you can choose to host a listening room or to join a listening room already hosted by other people </p>  
            <p>To host a room and play songs in queue, you need a <a href = "https://www.spotify.com/ae-en/premium/">Spotify Premium Account</a>. You can still host a room with a <a href = "https://www.spotify.com/ae-en/free/">Spotify Free Account</a>, but you will not be able to play songs in queue. Without any kind of Spotify Accounts, you will not be able to host a room  </p>
            <p>In a listening room, you can search for songs and add it to the queue. You can either like or dislike a song (both of these actions can be undone) and songs with the most likes will be played first in the queue </p>  
            <p>You can also choose a default playlist to be played if there are no songs in the queue</p>  
            <br></br>
            </div>
            <div className = "developed_by center">
            <h1>Developed by</h1> 
            <p> <a href = "https://www.linkedin.com/in/hdo2000/">Hieu Do</a></p>   
            <p><a href = "https://vulongphan.netlify.app/">Long Phan</a></p>
            </div>
        </div>
    )
}

export default About;