import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Collection, CollectionItem} from 'react-materialize';
import {DeckEditor} from './Deck.js';
const _ = require('lodash');
const mtg = require('mtgsdk');

class BrowseSets extends Component {
  constructor() {
    super()
    this.state = {
      sets: [],
      currentCardList: [],
      currentSet: false,
      deck: {
        name: 'Deck Name',
        description: 'This is the deck description',
        cards: []
      }
    }
    this.saveCardList = this.saveCardList.bind(this)
    this.getCards = this.getCards.bind(this)
    this.addCard = this.addCard.bind(this)
  }
  componentWillMount() {
    // Get list of all sets
    mtg.set.where({ type: 'expansion' })
      .then(sets => {
        // Store the sets
        sets.sort(function(a,b){
          return new Date(b.releaseDate) - new Date(a.releaseDate)
        })
        this.setState({ sets })

        // Get the current set if we're on a set page
        const setCode = this.props.match.params.code
        if (setCode) this.updateSet(setCode)
      })
  }
  componentWillReceiveProps(nextProps) {
    let setCode = nextProps.match.params.code
    if (setCode) this.updateSet(setCode)
  }
  updateSet = (setCode) => {
    // Get the set cards and update the state
    this.getCards(setCode)
    const currentSet = this.state.sets.find(function(set){
      return set.code === setCode
    })
    this.setState({ currentSet })
  }
  saveCardList = (currentCardList, updateCache) => {
    // Save card list to state,
    // then update Main card cache
    this.setState({currentCardList})
    if (updateCache) this.props.saveCardsToCache(currentCardList, updateCache)
  }
  getCards = (setCode) => {
    // Check if data is stored in Main
    const cachedCards = this.props.getCachedCards(setCode)
    if (cachedCards) {
      this.setState({currentCardList: cachedCards})
    } else {
      // If not, clear the list and grab cards from the API
      this.saveCardList([])
      let cards = [], update, i = 0
      mtg.card.all({ set: setCode })
        .on('data', card => {
          cards.push(card)
          // Let's not re-render 100+ times
          // Instead, render every 50 cards, or 500ms
          if (i > 25) {
            i = 0
            this.saveCardList(cards)
          } else {
            // By ensuring this is called last,
            // the Main cache will be sure to
            // contain the full card list
            clearTimeout(update)
            update = setTimeout(function(){
              this.saveCardList(cards, setCode)}.bind(this), 500)
          }
          i++
        })
    }
  }
  addCard = (card) => {
    let deck = this.state.deck
    const cardIndex = deck.cards.findIndex(function(c){return c.id === card.id})
    if (cardIndex === -1) {
      card.amount = 1
      deck.cards.push(card)
    } else {
      deck.cards[cardIndex].amount++
    }
    this.setState({ deck })
  }
  removeCard = (card) => {

  }
  render() {
    return (
      <div className="browse-lists">
        <div className="set-list">
          <SetList sets={this.state.sets} currentSet={this.state.currentSet} />
        </div>
        <SetCardList {...this.props} onClick={this.addCard} cards={this.state.currentCardList} set={this.state.currentSet} />
        <DeckEditor deck={this.state.deck} />
      </div>
    )
  }
}

class SetList extends Component {
  render() {
    if (!this.props.sets) return <p>Loading...</p>
    const props = this.props
    var setList = _.map(props.sets, function(set){
      const extraProps = props.currentSet && props.currentSet.code === set.code ? {className: 'active'} : {}
      return (
        <CollectionItem key={set.code} {...extraProps}>
          <Link to={'/set/' + set.code}>{set.name}</Link>
        </CollectionItem>
      )
    })
    return (
      <Collection>{setList}</Collection>
    )
  }
}

class SetCardList extends Component {
  render() {
    if (!this.props.cards) return null
    let props = this.props
    var cardList = _.map(props.cards, function(card) {
      return (
        <CollectionItem key={card.id} onClick={props.onClick.bind(this, card)} onMouseEnter={props.onCardHover.bind(this, card)}>
          {card.name}
        </CollectionItem>
      )
    })
    return (
      <div className="card-list">
        <Collection>{cardList}</Collection>
      </div>
    )
  }
}

export { BrowseSets }
