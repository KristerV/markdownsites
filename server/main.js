import {Meteor} from 'meteor/meteor';
import '/imports/api/sites/main.js';
import '/imports/api/domains/main.js';
import '/imports/api/users/main.js';
import '/imports/api/log/main.js';
import '/imports/api/payments/server/methods.js';
import '/imports/api/payments/server/router.js';

Meteor.startup(() => {
	AccountsGuest.anonymous = true;
});
