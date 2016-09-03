import {Meteor} from 'meteor/meteor';
import '/imports/api/sites/main.js';
import '/imports/api/domains/main.js';
import '/imports/api/payments/server/methods.js';


Meteor.startup(() => {
	AccountsGuest.anonymous = true;
});
