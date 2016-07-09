import {check} from 'meteor/check';

Meteor.methods({
	'sites.upsert'(siteId, data) {
		check(siteId, Match.Maybe(String));
		check(data, {
			content: Match.Maybe(String),
			domain: Match.Maybe(String),
			email: Match.Maybe(String)
		});

		// No duplicate domains allowed
		const domainExists = data.domain ? SitesCollection.findOne({
			$or: [
				{'published.domain': data.domain},
				{'editing.domain': data.domain}
			]
		}) : false;
		if (domainExists)
			throw new Meteor.Error(403, 'Domain already in use');

		// Don't allow accidental overwriting with empty content
		if ("content" in data && !data.content)
			throw new Meteor.Error(403, 'Empty content overwriting disabled');

		// Send login email when updating email
		if (data.email && siteId)
			Meteor.call('sites.addEditor', siteId, {email: data.email});


		// New site
		if (!siteId) {

			if (!this.userId)
				throw new Meteor.Error(403, "Guest id not generated yet");

			let insert = {
				editors: [this.userId],
				createdAt: new Date(),
				editing: data
			};
			return {newId: SitesCollection.insert(insert), msg: "Autosave is enabled"};
		}

		// User is editor: update
		const site = SitesCollection.findOne({_id: siteId, editors: this.userId});
		if (this.userId && site) {

			const editing = _.extend(site.editing, data);
			const result = SitesCollection.update(siteId, {$set: {editing}});

			if (data.domain)
				return {msg: "Domain updated", newId: data.domain};
			else
				return result
		}

		throw new Meteor.Error(403, 'Permission error');
	},
	'sites.publish'(siteId) {
		check(siteId, String);
		check(this.userId, String);

		const site = SitesCollection.findOne({_id: siteId, editors: this.userId});

		let errors = [];
		if (!site.editing.domain)
			errors.push('domain');
		if (!site.editing.email)
			errors.push('email');
		if (!site.editing.content)
			errors.push('content');
		if (!_.isEmpty(errors))
			throw new Meteor.Error(403, "Missing information: " + errors.join(' '))

		if (site) {
			const data = site.editing;
			SitesCollection.update(siteId, {$set: {published: data}, $addToSet: {history: data}});
			const url = Meteor.absoluteUrl() + data.domain;
			return {msg: `Site is now live at <a target="_blank" href="${url}">${url}</a>`, timeout: 15000};
		}

	},
	'sites.addEditor'(siteId, data) {
		check(data, {
			email: Match.Maybe(String),
			userId: Match.Maybe(String)
		});
		check(siteId, String);
		check(this.userId, String);

		function commitAdd(siteId, userId) {
			return SitesCollection.update(siteId, {$addToSet: {editors: userId}});
		}

		if (data.email && !data.userId) {
			Accounts.sendLoginEmail(data.email, function (result) {
				commitAdd(siteId, result.userId);
			})
		} else {
			const site = SitesCollection.findOne({_id: siteId, editors: this.userId});
			if (site)
				return commitAdd(siteId, this.userId)
		}
	}
});