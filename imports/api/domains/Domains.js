Domains = {
	updatePrices() {
		Meteor.call('domain.getAllPrices')
	}
};

Meteor.startup(() => {
	if (!Meteor.isDevelopment) {
		console.log("Not dev, start timer");
		Meteor.setTimeout(Domains.updatePrices, 1000 * 60 * 1);
	}
	Meteor.setInterval(Domains.updatePrices, 1000 * 60 * 60 * 24 * 3); // every 3 days
})
