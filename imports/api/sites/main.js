import './collection.js';
import './Sites.js';
import './helpers.js';
import './methods.js';

if (Meteor.isServer) {
	require('./server/publish.js');
}