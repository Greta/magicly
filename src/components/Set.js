import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Collection, CollectionItem} from 'react-materialize';
const _ = require('lodash');

class BrowseSets extends Component {
  render() {
    return (
      <div className='container'>
        <div className="set-list">
          <h1>List of Sets</h1>
          <SetList {...this.props} />
        </div>
        <div className="card-list">
          <h1></h1>
          <SetCardList {...this.props} />
        </div>
      </div>
    )
  }
}

class SetList extends Component {
  render() {
    if (!this.props.sets) return <p>Loading...</p>
    var setList = _.map(this.props.sets, function(set){
      return <CollectionItem key={set.code}><Link to={'/set/' + set.code}>{set.name}</Link></CollectionItem>
    })
    return (
      <Collection>{setList}</Collection>
    )
  }
}

class SetCardList extends Component {
  constructor(props) {
    super()
    this.state = {
      cards: props.cards
    }
  }
  componentWillMount() {
    // If the card list is empty, send a call to fill it
    if (!this.state.cards.length) this.props.updateCurrentSet(this.props.match.params.code)
  }
  componentWillReceiveProps(nextProps) {
    this.setState({cards: nextProps.cards})
  }
  render() {
    if (!this.state.cards) return null
    let props = this.props
    var cardList = _.map(this.state.cards, function(card) {
      return (
        <CollectionItem key={card.id} onMouseEnter={props.onCardHover.bind(this, card)}>
          {card.name}
        </CollectionItem>
      )
    })
    return (
      <Collection className='cardList'>{cardList}</Collection>
    )
  }
}

export { BrowseSets }
