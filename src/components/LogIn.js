import React from 'react';

function LogIn(props) {
  const isLoggedIn = props.loggedIn;
  const info = props.info;
  if (!isLoggedIn) {
    return (
      <button className="login">
        <a href="http://authentication-auxify.herokuapp.com/login"/*"http://localhost:8888/login"*/> Login to Spotify </a>
      </button>
    );
  }
  return (
    <div className="media-body">
      <img src={info.profileImage} type="width: 100%"></img>
      <h1 className="name">{info.name}</h1>
      <p className="country">{info.country}</p>
    </div>
  )
}

export default LogIn;
