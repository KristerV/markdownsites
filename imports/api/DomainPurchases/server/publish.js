Meteor.publish('domain-purchases', function(domain, siteId) {

	log.debug("PUBLISH domain-purchases", {domain, siteId});

	return DomainPurchasesCollection.find({domain, siteId});
});