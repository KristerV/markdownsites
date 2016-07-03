Meteor.publish('sites.single', function(siteId) {
	check(siteId, String);
	return SitesCollection.find({$or: [{_id: siteId}, {domain: siteId}]});
});

Meteor.publish('sites.list', function() {
	check(this.userId, 'String');
	return SitesCollection.find({userId: this.userId});
});
