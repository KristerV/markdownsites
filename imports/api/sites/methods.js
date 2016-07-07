import {check} from 'meteor/check';

Meteor.methods({
	'sites.new'(userId) {
		userId = userId || this.userId;
		if (!userId)
			throw new Meteor.Error(403, "App error: guest didn't get authorization.");
		data = {
			createdAt: new Date(),
			owners: [userId]
		};
		return SitesCollection.insert(data);
	},
	'sites.update'(siteId, data) {
		check(siteId, String);
		check(data, {
			content: Match.Maybe(String),
			domain: Match.Maybe(String),
			email: Match.Maybe(String)
		});

		let domainExists = SitesCollection.findOne({'published.domain': data.domain});
		let isOwner = SitesCollection.findOne({_id: siteId, owners: this.userId});

		// No duplicate domains allowed
		if (data.domain && data.domain === domainExists)
			throw new Meteor.Error(403, 'Domain already in use');

		// User is owner: update
		else if (this.userId && isOwner)
			return SitesCollection.update(siteId, {$set: data}) ? 'Saved' : 'Error: how did we end up here?';

		else
			throw new Meteor.Error(403, 'Permission error');
	},
});