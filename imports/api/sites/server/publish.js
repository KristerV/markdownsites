Meteor.publish('sites.single', function(siteId) {
	check(siteId, String);
	return SitesCollection.find(siteId);
});

Meteor.publish('sites.list', function() {
	check(this.userId, 'String');
	return SitesCollection.find({userId: this.userId});
});
