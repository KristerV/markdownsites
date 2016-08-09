Domains = {
	updatePrices() {
		Meteor.call('domain.getAllPrices')
	}
};

Meteor.startup(() => {
	Meteor.setTimeout(Domains.updatePrices, 1000)
})
