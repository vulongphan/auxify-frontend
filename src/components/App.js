import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import '../style/App.css';

import Room from './Room';
import About from './About';
import CreateRoom from './CreateRoom';
import JoinRoom from './JoinRoom';
import Expire from './Expire';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      is_private: null
    }
  }

  async componentDidMount() {
    await this.checkIncognito();
    while (this.state.is_private === true) {
      alert("Auxify currently does not support private mode. Sorry:(");
    }
  }

  async checkIncognito() {
    // work on Chrome and FireFox
    let is_private;
    if ("storage" in navigator && "estimate" in navigator.storage) {
      const { usage, quota } = await navigator.storage.estimate();
      // console.log(`Using ${usage} out of ${quota} bytes.`);
      if (quota < 1000000000) {
        is_private = true;
        // console.log("Chrome/FireFox: In Cognito");
      } else {
        is_private = false;
        // console.log("Chrome/FireFox: Not in Cognito");
      }
    } else {
      is_private = null;
      // console.log("Safari: Cannot detect");
    }
    // for Safari
    try { localStorage.test = 2; } catch (e) {
      is_private = true;
      // console.log("Safari: In Cognito");
    }
    this.setState({
      is_private: is_private
    })

  }

  render() {
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
        <p className="frombottom" id="about"><u><Link to={`/about`}>About</Link></u></p>
        <p className="frombottom" id="feedback"><u><a href="https://forms.gle/NsMB5L5Ge5THb6Hj7"> Feedback</a></u></p>
      </div>
    )
  }
}


export default App;
