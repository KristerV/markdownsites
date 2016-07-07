import {check} from 'meteor/check';

Meteor.methods({
	'sites.new'() {
		check(this.userId, String);
		data = {
			createdAt: new Date(),
			owners: [this.userId]
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

		const site = SitesCollection.findOne(siteId);

		if (data.domain && data.domain === site.domain)
			throw new Meteor.Error(403, 'Domain already in use');

		else if (!site.ownerId || (this.userId && site.ownerId === this.userId))
			return SitesCollection.update(siteId, {$set: data});

		else
			throw new Meteor.Error(403, 'Permission error');
	},
});