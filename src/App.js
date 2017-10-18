import React from 'react';
import logo from './logo.svg';
import {Switch, Route, Link} from 'react-router-dom';
import {Breadcrumb} from 'react-materialize';
import Main from './components/Main.js';

const App = () => (
  <div>
    <Header />
    <Breadcrumb>
      <Link to='/'>Magic the Gathering Sets</Link>
      <Switch>
        <Route path='/set/:code' render={(props) => (<a className="breadcrumb">{props.match.params.code}</a>)} />
      </Switch>
    </Breadcrumb>
    <Main />
  </div>
)

const Header = () => (
  <header className="valign-wrapper">
    <img src={logo} alt="logo" />
    <h2>Magicly</h2>
  </header>
)

export default App;
