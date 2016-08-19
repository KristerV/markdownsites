SitesCollection.helpers({
	domain: {
		getStatus() {},
		getDNSStatus() {},
		getPaymentStatus() {},
		getAvailability() {}
	},
	update(data) {
		return SitesCollection.update(this._id, data);
	}
});