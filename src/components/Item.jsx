import React, { Component } from 'react'

export class Item extends Component {
  render() {
    const { item, onMove, moveText, onTagClick, offset, tabName } = this.props;

    return (
      <div className='item' style={{ top: `${offset}px` }}>
        <span>{item.author}</span>
        <div className='title-wrapper'>
          <h3 className='title' title={item.title}>{item.title}</h3>
          <button onClick={onMove} className={`move-btn ${tabName}`}>{moveText}</button>
        </div>
        <p className='description' title={item.description}>{item.description}</p>
        <div className='tags'>
          <div>
            {item.tags.map((tag, i) => <button key={tag + i} onClick={() => onTagClick(tag)} className='tag'>{`#${tag}`}</button>)}
          </div>
        </div>
      </div>
    )
  }
}
