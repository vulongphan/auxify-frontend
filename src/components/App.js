import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import '../style/App.css';

import Room from './Room';
import About from './About';
import CreateRoom from './CreateRoom';
import JoinRoom from './JoinRoom';
import Expire from './Expire';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          {/* <nav className="navbar">
            <ul className="navbar-nav">
              <li><Link to={'/'} className="nav-link">Home</Link></li>
              <li><Link to={'/about'} className="right">About</Link></li>
              <li><Link to={'/create'} className="right">New Room</Link></li>
              <li><Link to={'/join'} className="right">Join Room</Link></li>
            </ul>
          </nav> */}
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
        <h1 className="fromtop text_style" >Welcome to Auxify</h1>
        <div className="btn-group fromtop" >
          {/* <button><Link to={'/'}>Home</Link></button> */}
          {/* <button><Link to={'/about'} >About</Link></button> */}
          <button><Link to={'/create'} >New Room</Link></button>
          <button><Link to={'/join'}>Join Room</Link></button>
        </div>

      </div>
    )
  }
}


const Footer = () => (
  <footer>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
    <button className="fa fa-github" />
  </footer>
)

export default App;
