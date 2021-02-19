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
    // console.log(navigator.cookieEnabled);

    // work on Chrome and FireFox
    let is_private;
    if ("storage" in navigator && "estimate" in navigator.storage) {
      const { usage, quota } = await navigator.storage.estimate();
      // console.log(`Using ${usage} out of ${quota} bytes.`);
      if (quota < 1000000000) {
        is_private = true;
        console.log("Chrome/FireFox: Incognito enabled");
      } else {
        is_private = false;
        console.log("Chrome/FireFox: Incognito disabled");
      }
    }
    // for Safari
    // else if (navigator.cookieEnabled === true) {
    //   is_private = false;
    //   console.log("Safari: Incognito disabled");
    // }

    // else if (/*navigator.cookieEnabled === false window.history === undefined*/ !window.RequestFileSystem) {
    //   is_private = true;
    //   console.log("Safari: Incognito enabled");
    // }
    /*Some failed attempts to check safari incognito mode*/
    // try { window.openDatabase(null, null, null, null); } catch (e) {
    //   console.log("Checking Safari browser");
    //   if (e.code === DOMException.QUOTA_EXCEEDED_ERR && storage.length === 0) {
    //     is_private = true;
    //     console.log("Safari: In Cognito");
    //   }
    // }
    // else if (!window.indexedDB && (window.PointerEvent || window.MSPointerEvent)) {
    //   is_private = true;
    //   console.log("Safari: In Cognito");
    // }
    else {
      console.log("Safari: Cannot detect");
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
