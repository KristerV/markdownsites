import {Meteor} from 'meteor/meteor';

// Sites
import '/imports/api/sites/collection.js';
import '/imports/api/sites/methods.js';
import '/imports/api/sites/server/publish';

// Domains
import '/imports/api/domains/collection.js';
import '/imports/api/domains/methods.js';
import '/imports/api/domains/Domains.js';


Meteor.startup(() => {
	AccountsGuest.anonymous = true;
});
