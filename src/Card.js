import React, {Component} from 'react';
const mtg = require('mtgsdk');

class Card extends Component {
  constructor(props) {
    super(props)
    this.state = {
      requestFailed: false
    }
    mtg.card.find(3)
      .then(result => {
        this.setState({
          card: result.card
        })
      })
  }
  render() {
    if (!this.state.card) return <p>Loading...</p>
    return (
      <div className="card">{this.state.card.name}</div>
    )
  }
}

class CurrentCard extends Component {
  render() {
    if (!this.props.card) return null
    return (
      <div id="currentCard">
        <img src={this.props.card.imageUrl} alt={this.props.card.name} />
      </div>
    )
  }
}

export { Card, CurrentCard }
