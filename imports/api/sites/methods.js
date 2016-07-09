import {check} from 'meteor/check';

Meteor.methods({
	'sites.upsert'(siteId, data) {
		check(siteId, Match.Maybe(String));
		check(data, {
			content: Match.Maybe(String),
			domain: Match.Maybe(String),
			email: Match.Maybe(String)
		});

		let domainExists = data.domain ? SitesCollection.findOne({'published.domain': data.domain}) : false;
		let isOwner = siteId ? SitesCollection.findOne({_id: siteId, owners: this.userId}) : true;

		// Don't allow accidental overwriting with empty content
		if ("content" in data && !data.content)
			throw new Meteor.Error(403, 'Empty content overwriting disabled');

		// New site
		if (!siteId) {
			if (!this.userId)
				throw new Meteor.Error(403, "Guest id not generated yet");
			data.owners = [this.userId]
			return {newId: SitesCollection.insert(data), msg: "Autosave is enabled"};
		}

		// No duplicate domains allowed
		else if (data.domain && data.domain === domainExists)
			throw new Meteor.Error(403, 'Domain already in use');

		// User is owner: update
		else if (this.userId && isOwner)
			return SitesCollection.update(siteId, {$set: data});

		else
			throw new Meteor.Error(403, 'Permission error');
	},
});