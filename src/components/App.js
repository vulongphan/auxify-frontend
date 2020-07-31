import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import '../style/App.css';

import Room from './Room';
import About from './About';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/about' component={About} />
          <Route path='/room' component={Room} />
        </Switch>
      </Router>
    )
  }
}

const Home = () => (
  <div>
    <h1>Home Page</h1>
    <button className="login">
      <a href="http://authentication-auxify.herokuapp.com/login"/*"http://localhost:8888/login"*/> Create a room </a>
    </button>
  </div>
)

export default App;
