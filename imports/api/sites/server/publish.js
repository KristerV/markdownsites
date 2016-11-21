Meteor.publish('sites.single', function(siteId, domain) {

	log.debug("PUBLISH sites.single", {siteId, domain});

	if (!siteId && !domain)
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

	if (!siteId && domain) {
		if (domain.indexOf('.ee') > -1) { // HACK to enable custom .ee domains
			return SitesCollection.find({domain}, {fields: fields});
		} else {
			const domainItem = DomainPurchasesCollection.findOne({"transactionResult.success": true, domain});
			return SitesCollection.find(G.ifDefined(domainItem, 'siteId'), {fields: fields});
		}
	} else {
		return SitesCollection.find(siteId, {fields: fields});
	}
});

Meteor.publish('sites.list', function() {
	log.debug("PUBLISH sites.list", {userId: this.userId});
	if (!this.userId)
		return;
	check(this.userId, String, "Sites.list is published only with this.userId");
	return SitesCollection.find({editors: this.userId});
});
