import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import {CurrentCard} from './Card.js';
import {BrowseSets} from './Set.js';
import {Decks, Deck} from './Deck.js';

class Main extends Component {
  constructor() {
    super()
    this.state = {
      currentCard: false
    }
    this.cardCache = {}
    this.getCachedCards = this.getCachedCards.bind(this)
    this.saveCardsToCache = this.saveCardsToCache.bind(this)
    this.onCardHover = this.onCardHover.bind(this)
  }
  getCachedCards = (setCode) => {
    return this.cardCache[setCode]
  }
  saveCardsToCache = (cards, setCode) => {
    this.cardCache[setCode] = cards
  }
  onCardHover = (currentCard) => {
    // this.setState({currentCard})
  }
  render() {
    const extraProps = {
      getCachedCards: this.getCachedCards,
      saveCardsToCache: this.saveCardsToCache,
      onCardHover: this.onCardHover
    }
    return (
      <main>
        <CurrentCard card={this.state.currentCard} />
        <Switch>
          <Route exact path='/' render={(props) => (<BrowseSets {...props} {...extraProps} /> )} />
          <Route path='/set/:code' render={(props) => (<BrowseSets {...props} {...extraProps} />)} />
          <Route path='/decks' component={Decks} />
          <Route path='/deck/:id' component={Deck} />
        </Switch>
      </main>
    )
  }
}

export default Main;
