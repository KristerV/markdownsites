import {Meteor} from 'meteor/meteor';

// Sites
import '/imports/api/sites/collection.js';
import '/imports/api/sites/server/methods.js';
import '/imports/api/sites/server/publish';

Meteor.startup(() => {
});
