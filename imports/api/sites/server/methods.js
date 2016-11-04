import {check} from 'meteor/check';

Meteor.methods({
	'sites.upsert'(siteId, data) {

		log.debug("METHOD sites.upsert", {siteId, data});

		check(siteId, Match.Maybe(String));
		check(data, {
			content: String,
			domain: String,
			email: String
		}, 'Sites.upsert data missing');
		check(this.userId, String, "Upsert requester has no userId");

		// Insert new site
		if (!siteId) {
			data.editors = [this.userId];
			data.createdAt = new Date();
			siteId = SitesCollection.insert(data);
			Meteor.call('sites.sendLoginEmail', data.email, siteId);
			return {siteId};
		// Update existing site
		} else {
			const site = SitesCollection.findOne({_id: siteId, editors: this.userId});
			if (!site)
				throw new Meteor.Error(403, "User does not own the site");
			data.modifiedAt = new Date();
			const update = SitesCollection.update(siteId, {$set: data});
			if (site.email !== data.email)
				Meteor.call('sites.sendLoginEmail', data.email, siteId);
			return {update};
		}
	},
	'sites.sendLoginEmail'(email, siteId) {
		Accounts.sendLoginEmail(email, userId => {
			if (siteId)
				SitesCollection.update(siteId, {$addToSet: {editors: userId}});
		});
	}
});