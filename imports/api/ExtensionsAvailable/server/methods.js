Meteor.methods({
	'updateAvailableExtensions'() {
		NamecheapServices.updateDomainPrices();
	}
});
