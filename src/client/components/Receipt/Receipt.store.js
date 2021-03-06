'use strict';

/**
 * @file
 * Store for the Receipt component
 */

import {isArray} from 'lodash';
import Reflux from 'reflux';
import ReceiptActions from './Receipt.action.js';

const ReceiptStore = Reflux.createStore({
  store: {},

  getState() {
    return this.store;
  },

  init() {
    this.listenTo(ReceiptActions.updated, this.update);
  },

  update(response) {
    if (response.error && !isArray(response.error) || response.error.length > 0) {
      this.store.error = true;
    }
    else {
      const pid = response.info.pids.toString();
      this.store[pid] = response.result.hasOwnProperty('orderPlaced') ? response.result.orderPlaced : 'false';
    }

    this.pushStore();
  },

  pushStore() {
    this.trigger(this.store);
  }
});

export default ReceiptStore;
