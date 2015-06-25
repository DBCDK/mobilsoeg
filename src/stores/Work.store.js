'use strict';

import Reflux from 'reflux';
import WorkActions from '../actions/Work.action.js';
import CoverImageActions from '../actions/CoverImage.action.js';

// Setup dataobject for query
// @todo We may need to initialize it with data from the URL or an global object
let _store = {
  result: [],
};

/**
 * Store containing the current query of the page
 */
let WorkStore = Reflux.createStore({

  // Initial setup by reflux
  init() {
    // Register statusUpdate action
    this.listenTo(WorkActions.updated, this.update);
  },

  // update the work object and trigger an action
  update(result) {
    let work = result.result || [];
    // this.callImageActions(work);
    _store.result = work;
    this.trigger(_store);
  },

  callImageActions(work) {
    work.forEach(result => CoverImageActions(result.identifiers));
  },

  // return the store data
  getStore() {
    return _store;
  }
});

export default WorkStore;
