import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import '../style/App.css';

import NavigationBar from './NavigationBar';
import Room from './Room';
import About from './About';
import CreateRoom from './CreateRoom';
import JoinRoom from './JoinRoom';
import Expire from './Expire';
import Instruction from './Instruction';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <NavigationBar />
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/about' component={About} />
            <Route path='/instruction' component={Instruction} />
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
        <p className="text_style" id="developed_by"> Developed by <a href = "https://www.linkedin.com/in/hdo2000/">Hieu Do</a> and <a href = "https://vulongphan.netlify.app/">Vu Long Phan</a>.</p>
      </div>
    )
  }
}

export default App;
