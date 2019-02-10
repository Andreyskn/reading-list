import React, { Component } from 'react';

const titles = {
  toread: 'To read',
  inprogress: 'In progress',
  done: 'Done',
}

export class Tabs extends Component {
  render() {
    const { items, activeTab, onClick } = this.props;

    return (
      <div className='tabs-bar'>
        {Object.keys(items).map(key => (
          <button key={key} className={'tab-btn' + (key === activeTab ? ' active' : '')} onClick={() => onClick(key)}>
            {`${titles[key]} (${items[key].length})`}
          </button>
        ))}
      </div>
    )
  }
}
