Domains = {
	updatePrices() {
		Meteor.call('domain.getAllPrices')
	}
};

Meteor.startup(() => {
	Meteor.setTimeout(Domains.updatePrices, 1000 * 60 * 10);
	Meteor.setInterval(Domains.updatePrices, 1000 * 60 * 60 * 24 * 3); // every 3 days
})
