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
			content: Match.Maybe(String),
			domain: Match.Maybe(String),
			email: Match.Maybe(String)
		});
		return SitesCollection.update(siteId, {$set: data});
	}
});