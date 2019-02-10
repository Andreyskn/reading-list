import React, { Component } from 'react'

export class Filter extends Component {
  render() {
    const { tags, clear, onTagClick } = this.props;

    return (
      <div className='filter'>
        <span>Filtered by tags: </span>
        {tags.map(tag => <button key={tag} onClick={() => onTagClick(tag)} className='tag'>{`#${tag}`}</button>)}
        <button onClick={clear} className='clear'>(clear)</button>
      </div>
    )
  }
}
