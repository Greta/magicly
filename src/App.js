import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import logo from './logo.svg';
import {Footer} from 'react-materialize'

import {Sets, Set} from './Set.js';
import {Decks, Deck} from './Deck.js';
import {CurrentCard} from './Card.js';
const mtg = require('mtgsdk');
const _ = require('lodash');

const App = () => (
  <div>
    <Header />
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

class Main extends Component {
  constructor() {
    super()
    this.state = {
      sets: [],
      cards: {},
      currentCard: false
    }
    this.onCardHover = this.onCardHover.bind(this)

    // Get list of all sets
    mtg.set.where({ type: 'expansion' })
      .then(sets => {
        sets.sort(function(a,b){
          return new Date(b.releaseDate) - new Date(a.releaseDate)
        })
        this.setState({ sets })
      })
  }
  onCardHover(currentCard) {
    this.setState({currentCard})
  }
  render() {
    let setList = {
      sets : this.state.sets
    }
    return (
      <main>
        <CurrentCard card={this.state.currentCard} />
        <Switch>
          <Route exact path='/' render={() => (<Sets data={setList} />)} />
          <Route path='/set/:code' render={(props) => (<Set {...props} onCardHover={this.onCardHover} />)} />
          <Route path='/decks' component={Decks} />
          <Route path='/deck/:id' component={Deck} />
        </Switch>
      </main>
    )
  }
}

export default App;
