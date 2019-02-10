import React, { Component } from 'react';

import { Item } from './Item';

const moveBtnTitles = {
  toread: 'start reading',
  inprogress: 'finish reading',
  done: 'return in «to read»',
}

const ITEM_HEIGHT = 240;
const RENDER_LIMIT = 4;

export class ShowCase extends Component {

  _showcase = null;

  state = {
    startRenderIndex: 0,
  }

  componentDidMount() {
    this._showcase.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    this._showcase.removeEventListener('scroll', this.onScroll);
  }

  onScroll = (event) => {
    const { startRenderIndex } = this.state;
    const scrollTop = Math.floor(event.target.scrollTop);
    const currentTopItem = Math.floor(scrollTop / ITEM_HEIGHT);

    currentTopItem !== startRenderIndex && this.setState({ startRenderIndex: currentTopItem });
  }

  render() {
    const {
      state: { startRenderIndex },
      props: { items, data, activeTab, onMoveItem, onTagClick },
    } = this;

    const contentHeight = { height: `${items.length * ITEM_HEIGHT}px` };
    const itemsToRender = items.slice(startRenderIndex, startRenderIndex + RENDER_LIMIT);

    return (
      <div className='showcase' ref={x => this._showcase = x}>
        <div className='content' style={contentHeight}>
          {itemsToRender.map((itemId, i) => (
            <Item
              item={data[itemId]}
              offset={(startRenderIndex + i) * ITEM_HEIGHT}
              key={itemId}
              moveText={moveBtnTitles[activeTab]}
              onMove={() => onMoveItem(activeTab, itemId)}
              onTagClick={onTagClick} 
              tabName={activeTab} />
          ))}
        </div>
      </div>
    )
  }
}
