import './collection.js';
import './Domains.js';

if (Meteor.isServer) {
	require('./server/publish');
}