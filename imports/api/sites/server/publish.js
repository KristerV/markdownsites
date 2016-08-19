Meteor.publish('sites.single', function(siteId) {
	if (!siteId)
		return;

	let fields = {
		editing: 1,
		published: 1,
		createdAt: 1
	};

	let isOwner = !!SitesCollection.findOne({_id: siteId, editors: this.userId});
	if (isOwner)
		fields.editors = 1;

	return SitesCollection.find(
		{$or: [{_id: siteId}, {'editing.domain.name': siteId}]},
		{fields: fields}
	);
});

Meteor.publish('sites.list', function() {
	check(this.userId, String, "Sites.list is published only with this.userId");
	return SitesCollection.find({editors: this.userId});
});
