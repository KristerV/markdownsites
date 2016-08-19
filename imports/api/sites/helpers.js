SitesCollection.helpers({
	updateDomainStatus() {
		if (Meteor.isClient) { // API keys are only on server
			Meteor.call('sites.updateDomainStatus', this._id);
			return;
		}
		
		// There are 3 things we need to know
		console.log("START PROMISES");
		Promise.all([DomainServices.getDNSStatus(this._id), DomainServices.getPaymentStatus(this._id), DomainServices.getAvailability(this._id)])
		.then(Meteor.bindEnvironment(values => {
			console.log("SUCCESS: PROMISES");

			const dnsStatus = values[0];
			console.log("dnsStatus", dnsStatus);
			const paymentStatus = values[1];
			console.log("paymentStatus", paymentStatus);
			const availability = DomainServices.parseAvailabilityResponse(values[2]);
			console.log("availability", availability);

			let status = {status: null, label: 'no domain', msg: null};
		}))
		.catch(DomainServices.parseError)
	},
	update(data) {
		return SitesCollection.update(this._id, {$set: data});
	}
});