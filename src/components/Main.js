import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import {CurrentCard} from './Card.js';
import {BrowseSets} from './Set.js';
import {Decks, Deck} from './Deck.js';

const mtg = require('mtgsdk');

class Main extends Component {
  constructor() {
    super()
    this.state = {
      sets: [],
      cards: [],
      currentSet: false,
      currentCard: false
    }
    this.cardCache = {}
    this.onCardHover = this.onCardHover.bind(this)
    this.updateCardList = this.updateCardList.bind(this)
    this.updateCurrentSet = this.updateCurrentSet.bind(this)
    this.getSetCards = this.getSetCards.bind(this)

    // Get list of all sets
    mtg.set.where({ type: 'expansion' })
      .then(sets => {
        sets.sort(function(a,b){
          return new Date(b.releaseDate) - new Date(a.releaseDate)
        })
        this.setState({ sets })
        if (this.state.currentSet) this.getSetCards()
      })
  }
  onCardHover = (currentCard) => {
    // this.setState({currentCard})
  }
  updateCurrentSet = (currentSet) => {
    console.log('updateCurrentSet called')
    this.setState({currentSet})
  }
  updateCardList = (cards, updateCache) => {
    this.setState({cards})
    if (updateCache) this.cardCache[updateCache] = cards
  }
  getSetCards = () => {
    if (!this.state.currentSet) return

    // Check if data is stored in Main
    const setCode = this.state.currentSet
    console.log(this.cardCache)
    if (this.cardCache[setCode]) this.setState({cards: this.cardCache[setCode]})

    // If not, grab it from the API
    let cards = [], update, i = 0
    mtg.card.all({ set: setCode })
      .on('data', card => {
        cards.push(card)
        // Let's not re-render 100+ times
        // Instead, render every 50 cards, or 1000ms
        if (i > 50) {
          i = 0
          this.updateCardList(cards)
        } else {
          clearTimeout(update)
          update = setTimeout(function(){this.updateCardList(cards, setCode)}.bind(this), 1000)
        }
        i++
      })
  }
  render() {
    const extraProps = {
      sets: this.state.sets,
      cards: this.state.cards,
      currentSet: this.state.currentSet,
      updateCurrentSet: this.updateCurrentSet,
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
