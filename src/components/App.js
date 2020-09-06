import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import '../style/App.css';

import Room from './Room';
import About from './About';
import CreateRoom from './CreateRoom';
import JoinRoom from './JoinRoom';
import Expire from './Expire';
import NoConnection from './NoConnection';
import Maintainance from './Maintainance';

var maintainance = false;
var online = navigator.onLine; //internet connection status of browser

class App extends React.Component {
  render() {
    if (maintainance === false) { //if no maintainance if needed
      if (online === false) { //if there is no internet connection
        console.log("No internet connection")
        return (
          <NoConnection />
        )
      }
      else { //if there is internet connection
        return (
          <Router>
            <div>
              <Switch>
                <Route path='/' exact component={Home} />
                <Route path='/about' component={About} />
                <Route path='/room' component={Room} />
                <Route path='/create' component={CreateRoom} />
                <Route path='/join' component={JoinRoom} />
                <Route path='/expire' component={Expire} />
              </Switch>
            </div>
          </Router>
        )
      }
    }
    else { //if maintainance is needed
      return (
        <Router>
          <div>
            <Switch>
              <Route path='/' exact component={Maintainance} />
            </Switch>
          </div>
        </Router>
      )
    }
  }
}

class Home extends React.Component {
  render() {
    return (
      <div className="homePage center" >
        <h1 className="fromtop text_style" id="welcome" >Welcome to Auxify</h1>
        <div className="btn-group fromtop" >
          <form action='/create'>
            <button type="submit" className="roomAction" >New Room</button>
          </form>
          <form action='/join'>
            <button type="submit" className="roomAction">Join Room</button>
          </form>
        </div>
        <p className="frombottom"><u><Link to={`/about`}>About</Link></u></p>
      </div>
    )
  }
}


export default App;
