import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import {Sets, Set} from './Set.js';
import {Decks, Deck} from './Deck.js';
import {CurrentCard} from './Card.js';

const mtg = require('mtgsdk');
const _ = require('lodash');

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

export default Main;
