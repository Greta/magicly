import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Collection, CollectionItem, Breadcrumb, MenuItem} from 'react-materialize';
const _ = require('lodash');
const mtg = require('mtgsdk');

class Sets extends Component {
  render() {
    return (
      <div className='container'>
        <h1>List of Sets</h1>
        <SetList {...this.props} />
      </div>
    )
  }
}

class SetList extends Component {
  render() {
    if (!this.props.data.sets) return <p>Loading...</p>
    var setList = _.map(this.props.data.sets, function(set){
      return <CollectionItem key={set.code}><Link to={'/set/' + set.code}>{set.name}</Link></CollectionItem>
    })
    return (
      <Collection>{setList}</Collection>
    )
  }
}

class Set extends Component {
  constructor(props) {
    super()
    this.state = {
      set: null
    }
    mtg.set.find(props.match.params.code )
      .then(result => {
        this.setState({set: result.set})
      })
  }
  render() {
    if (!this.state.set) return null
    return (
      <div>
        <Breadcrumb>
          <MenuItem><Link to='/'>Magic the Gathering Sets</Link></MenuItem>
          <MenuItem>{this.state.set.name}</MenuItem>
        </Breadcrumb>
        <div className='container'>
          <h1>{this.state.set.name}</h1>
          <SetCardList {...this.props} />
        </div>
      </div>
    )
  }
}

class SetCardList extends Component {
  constructor(props) {
    super()
    this.state = {
      cards: []
    }
    mtg.card.all({ set: props.match.params.code })
      .on('data', card => {
        var cards = this.state.cards
        cards.push(card)
        this.setState({ cards })
      })
  }
  render() {
    if (!this.state.cards) return <p>Loading</p>
    let props = this.props
    var cardList = _.map(this.state.cards, function(card) {
      return <CollectionItem key={card.id} onMouseEnter={props.onCardHover.bind(this, card)}>{card.name}</CollectionItem>
    })
    return (
      <Collection className='cardList'>{cardList}</Collection>
    )
  }
}

export { Sets, Set }
