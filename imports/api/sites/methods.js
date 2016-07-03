import {check} from 'meteor/check';

Meteor.methods({
	'sites.new'() {
		data = {
			createdAt: new Date()
		};
		if (this.userId)
			data.userId = this.userId;
		return SitesCollection.insert(data);
	},
	'sites.update'(siteId, data) {
		check(siteId, String);
		check(data, {
			content: String
		});
		return SitesCollection.update(siteId, {$set: data});
	}
});