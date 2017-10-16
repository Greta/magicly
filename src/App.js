import React from 'react';
import logo from './logo.svg';
import {Switch, Route, Link} from 'react-router-dom';
import {Footer} from 'react-materialize';
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
    <Footer copyrights="&copy; 2015 Copyright Text"
      moreLinks={
        <a className="grey-text text-lighten-4 right" href="#!">More Links</a>
      }
      links={
        <ul>
          <li><a className="grey-text text-lighten-3" href="#!">Link 1</a></li>
          <li><a className="grey-text text-lighten-3" href="#!">Link 2</a></li>
          <li><a className="grey-text text-lighten-3" href="#!">Link 3</a></li>
          <li><a className="grey-text text-lighten-3" href="#!">Link 4</a></li>
        </ul>
      }
      className='example'
    >
      <h5 className="white-text">Footer Content</h5>
      <p className="grey-text text-lighten-4">You can use rows and columns here to organize your footer content.</p>
    </Footer>
  </div>
)

const Header = () => (
  <header className="valign-wrapper">
    <img src={logo} alt="logo" />
    <h2>Magicly</h2>
  </header>
)

export default App;
