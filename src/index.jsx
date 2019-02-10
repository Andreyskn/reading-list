import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './styles.css';
import data from './data-proxy';

import { Tabs, ShowCase, Filter } from './components';


const initialFilterState = { isActive: false, tags: [], items: [] };

class App extends Component {

  _data = data.items;
  _container = null;
  _urlParams = new URLSearchParams(window.location.search);

  state = {
    items: {
      toread: [],
      inprogress: [],
      done: [],
    },
    activeTab: 'toread',
    filter: initialFilterState,
  }

  componentDidMount() {
    this.parseUrlParams(this.handleData());
    window.addEventListener('popstate', this.handlePopState);
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.handlePopState);
  }

  handlePopState = () => {
    this._urlParams = new URLSearchParams(window.location.search);
    this.parseUrlParams(this.state.items);
  }

  handleData = () => {
    const cachedDataLength = Number(localStorage.getItem('dataLength'));
    let items;

    if (this._data.length === cachedDataLength) {
      items = JSON.parse(localStorage.getItem('state'));
      this.setState({ items });
    } else {
      items = {
        toread: [],
        inprogress: [],
        done: [],
      };
      for (let i = 0; i < this._data.length; i++) {
        items.toread.push(i);
      }
      this.setState({ items });
      this.saveState(items);
      localStorage.setItem('dataLength', this._data.length);
    }

    return items;
  }

  saveState = (items) => {
    localStorage.setItem('state', JSON.stringify(items));
  }

  parseUrlParams = (items) => {
    const tabParam = this._urlParams.get('tab');
    const tagsParam = this._urlParams.get('tags');
    const validTabName = tabParam && ['toread', 'inprogress', 'done'].includes(tabParam);

    validTabName && this.setState({ activeTab: tabParam });
    this.filterByUrlParams(tagsParam, items, validTabName ? tabParam : 'toread');
  }

  changeTab = (tabId) => {
    if (tabId !== this.state.activeTab) {
      this.setState({ activeTab: tabId });
      this.state.filter.isActive && this.clearFilter();
      this._urlParams.set('tab', tabId);
      window.history.pushState(null, null, '?' + this._urlParams);
    }
  }

  filterByTag = (tag) => {
    const { items, activeTab, filter } = this.state;
    if (filter.tags.includes(tag)) return;

    const itemsToFilter = filter.items.length ? filter.items : items[activeTab];
    const tags = [...filter.tags, tag];
    const filteredItems = itemsToFilter.filter(id => this._data[id].tags.includes(tag));
    this.setState({ filter: { isActive: true, tags, items: filteredItems } });

    const tagParams = this._urlParams.getAll('tags');
    this._urlParams.set('tags', [...tagParams, tag]);
    const newParams = this._urlParams.toString().replace(/%2C/g, ',');
    window.history.pushState(null, null, '?' + newParams);
  }

  removeTagFromFilter = (tag) => {
    const { items, activeTab, filter } = this.state;
    const lastTag = filter.tags.length === 1;
    let newParams;

    if (lastTag) {
      this.setState({ filter: initialFilterState });
      this._urlParams.delete('tags');
      newParams = this._urlParams;
    } else {
      const tags = filter.tags.filter(t => t !== tag);
      const filteredItems = items[activeTab].filter(id => tags.every(tag => this._data[id].tags.includes(tag)));
      this.setState({ filter: { isActive: true, tags, items: filteredItems } });
      const tagParams = this._urlParams.get('tags').split(',');
      this._urlParams.set('tags', tagParams.filter(t => t !== tag));
      newParams = this._urlParams.toString().replace(/%2C/g, ',');
    }

    const hasParams = this._urlParams.get('tab') || this._urlParams.get('tags');
    window.history.pushState(null, null, hasParams ? `?${newParams}` : '/');
  }

  filterByUrlParams = (tagsParam, items, tab) => {
    if (!tagsParam) {
      this.state.filter.isActive && this.setState({ filter: initialFilterState });
      return;
    }

    const tags = tagsParam.split(',')
    const filteredItems = items[tab].filter(id => tags.every(tag => this._data[id].tags.includes(tag)));
    this.setState({ filter: { isActive: true, tags, items: filteredItems } });
  }

  clearFilter = () => {
    this.setState({ filter: initialFilterState });
    this._urlParams.delete('tags');
    const hasTabParam = this._urlParams.get('tab');
    window.history.pushState(null, null, hasTabParam ? `?${this._urlParams}` : '/');
  }

  moveItem = (tabId, itemId) => {
    const { filter } = this.state;
    let targetTab;
    if (tabId === 'toread') targetTab = 'inprogress';
    if (tabId === 'inprogress') targetTab = 'done';
    if (tabId === 'done') targetTab = 'toread';

    const originTabItems = this.state.items[tabId].filter(id => id !== itemId);
    const targetTabItems = [...this.state.items[targetTab], itemId];
    const itemsInFilter = filter.items.length ? filter.items.filter(id => id !== itemId) : [];
    const items = { 
      ...this.state.items,
      [tabId]: originTabItems,
      [targetTab]: targetTabItems
    }

    this.setState(s => {
      return {
        items,
        filter: {
          ...s.filter,
          items: itemsInFilter,
        }
      }
    });
    this.saveState(items);
  }

  render() {
    const { items, activeTab, filter, scrollTop } = this.state;
    const itemsToShow = filter.isActive ? filter.items : items[activeTab];

    const showCaseProps = {
      activeTab, scrollTop, items: itemsToShow, data: this._data,
      onMoveItem: this.moveItem, onTagClick: this.filterByTag,
    }

    return (
      <div className='app'>
        <Tabs items={items} activeTab={activeTab} onClick={this.changeTab} />
        <div className='container'>
          {filter.isActive && <Filter {...filter} clear={this.clearFilter} onTagClick={this.removeTagFromFilter} />}
          {!itemsToShow.length && <span className='stub'>List is empty</span>}
          <ShowCase {...showCaseProps} />
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
