import './collection.js';

if (Meteor.isServer) {
	require('./server/publish.js');
}