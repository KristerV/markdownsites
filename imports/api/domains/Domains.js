Domains = {
	updatePrices() {
		Meteor.call('domain.getAllPrices')
	},
	getStatus(siteId) {
		const site = SitesCollection.findOne(siteId);
		if (!G.isDefined(site, 'domain.isChecking'))
			return null
		
		// There are 3 main stages to statuses: isAvailable, isPaymentReceived, isConnected
		if (site.editing.domain.isChecking)
			return 'checking';
		else if (site.editing.domain.isAvailable === false)
			return 'taken';
		else if (!site.editing.domain.isAvailable)
			return null;
		else if (site.editing.domain.isAvailable)
			return 'available';
		else if (site.editing.domain.isPaymentMade)
			return 'paymentProcessing';
		else if (site.editing.domain.isPaymentSent)
			return 'paymentProcessing';
		else if (site.editing.domain.isPaymentCleared)
			return 'paymentCleared';
		else if (site.editing.domain.isDomainBought)
			return 'domainBought';
		else if (site.editing.domain.isDomainConnected)
			return 'domainConnected';
		
	}
};

Meteor.startup(() => {
	if (!Meteor.isDevelopment) {
		Meteor.setTimeout(Domains.updatePrices, 1000 * 60 * 1);
	}
	Meteor.setInterval(Domains.updatePrices, 1000 * 60 * 60 * 24 * 3); // every 3 days
})
