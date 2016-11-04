Meteor.publish('sites.single', function(siteId) {

	log.debug("PUBLISH sites.single", {siteId});

	if (!siteId)
		return SitesCollection.find({_id: "findnothing-hahaha"});
	// why return this fake find? Because otherwise going from a /:siteId to / will not empty the fields

	let fields = {
		domain: 1,
		content: 1,
	};

	let isOwner = !!SitesCollection.findOne({_id: siteId, editors: this.userId});
	if (isOwner) {
		fields.editors = 1;
		fields.email = 1;
		fields.createdAt = 1;
	}

	return SitesCollection.find(
		{$or: [{_id: siteId}, {'editing.domain.name': siteId}]},
		{fields: fields}
	);
});

Meteor.publish('sites.list', function() {
	log.debug("PUBLISH sites.list", {userId: this.userId});
	if (!this.userId)
		return;
	check(this.userId, String, "Sites.list is published only with this.userId");
	return SitesCollection.find({editors: this.userId});
});
