import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import '../style/App.css';

import Room from './Room';
import About from './About';
import CreateRoom from './CreateRoom';
import JoinRoom from './JoinRoom';
import Expire from './Expire';
import Maintainance from './Maintainance';

var maintainance = false;

class App extends React.Component {
  render() {
    if (!maintainance) { //if no maintainance if needed
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
        <p className="frombottom" id = "about"><u><Link to={`/about`}>About</Link></u></p>
        <p className = "frombottom" id = "feedback"><u><a href = "https://forms.gle/NsMB5L5Ge5THb6Hj7"> Feedback</a></u></p>
      </div>
    )
  }
}


export default App;
