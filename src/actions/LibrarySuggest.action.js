'use strict';

import Reflux from 'reflux';
import SocketClient from 'dbc-node-serviceprovider-socketclient';
let socket = SocketClient('getEntitySuggestions');

const LibrarySuggestActions = Reflux.createActions({
  textfieldUpdated: {children: ['response']},
  clear: {}
});

LibrarySuggestActions.textfieldUpdated.listen((val) => {
  socket.request(val);
});

socket.response(LibrarySuggestActions.textfieldUpdated.response);

export default LibrarySuggestActions;
