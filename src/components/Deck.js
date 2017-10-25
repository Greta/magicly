import React, {Component} from 'react';
const _ = require('lodash');

const _types = [
  'Creature',
  'Instant',
  'Sorcery',
  'Enchantment',
  'Artifact',
  'Planeswalker',
  'Land'
]

const Decks = () => (
  <div>
    This is the Decks component
  </div>
)

const Deck = () => (
  <div>
    This is the Deck component
  </div>
)

class SortedGroup extends Component {
  render() {
    if (!this.props.cards.length) return null
    const cardList = _.map(this.props.cards, function(card){
      const amt = card.amount > 1 ? card.amount + 'x' : ''
      return <li key={card.id}><span>{amt}</span>{card.name}</li>
    })
    return (
      <div>
        <h5>{this.props.type}</h5>
        <ul>
          {cardList}
        </ul>
      </div>
    )
  }
}

class DeckList extends Component {
  constructor(props) {
    super()
    this.state = {
      sortedCards: this.sortCards(props.cards)
    }
  }
  sortCards = (cards) => {
    const cardList = cards.slice()
    let sortedCards = {}
    _.each(_types, (type) => {
      let matchedCards = _.remove(cardList, (card) => {
        return card.types.includes(type)
      })
      sortedCards[type] = matchedCards.sort((a,b) => {
        let nameA = a.name.toUpperCase(),
            nameB = b.name.toUpperCase()
        if (nameA < nameB) return -1
        return 1
      })
    })
    return sortedCards
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ sortedCards: this.sortCards(nextProps.cards) })
  }
  render() {
    let i = 0
    const cardGroups = _.map(this.state.sortedCards, function(group, type) {
      i++
      return <SortedGroup type={type} cards={group} key={i} />
    })
    return <div className='cols c2'>{cardGroups}</div>
  }
}

class DeckEditor extends Component {
  render() {
    const content = this.props.deck.cards.length
      ? <DeckList cards={this.props.deck.cards} />
      : 'Click on a card to add it to your deck'
    return (
      <div className="deck-list">
        <h2>{this.props.deck.name}</h2>
        <p>{this.props.deck.description}</p>
        {content}
      </div>
    )
  }
}

export { Decks, Deck, DeckEditor }
