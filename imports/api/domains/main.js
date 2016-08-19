import './collection.js';
import './Domains.js';

if (Meteor.isServer) {
	require('./server/methods.js');
	require('./server/DomainServices.js');
}
