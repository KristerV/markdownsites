Meteor.publish('sites.single', function(siteId) {
	check(siteId, String);

	let fields = {
		content: 1,
		domain: 1,
		email: 1
	};

	let isOwner = !!SitesCollection.findOne({_id: siteId, owners: this.userId});
	if (isOwner)
		fields.owners = 1;

	return SitesCollection.find(
		{$or: [{_id: siteId}, {domain: siteId}]},
		{fields: fields}
	);
});

Meteor.publish('sites.list', function() {
	check(this.userId, String);
	return SitesCollection.find({owners: this.userId});
});
