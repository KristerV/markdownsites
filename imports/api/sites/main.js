import './collection.js';
import './Sites.js';
import './helpers.js';

if (Meteor.isServer) {
	require('./server/publish.js');
	require('./server/methods.js');
}