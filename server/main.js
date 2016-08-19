import {Meteor} from 'meteor/meteor';
import '/imports/api/sites/main.js';
import '/imports/api/domains/main.js';


Meteor.startup(() => {
	AccountsGuest.anonymous = true;
});
