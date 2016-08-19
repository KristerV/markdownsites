SitesCollection.helpers({
	updateDomainStatus() {
		if (Meteor.isClient) { // API keys are only on server
			Meteor.call('sites.updateDomainStatus', this._id);
			return;
		}

		const domainName = this.editing.domain.name;

		if (!domainName)
			this.update({$set: {'editing.domain.label': 'not connected'}});
		else
			this.update({$set: {'editing.domain.label': 'checking'}});

		// There are 3 things we need to know
		console.log("START PROMISES");
		Promise.all([DomainServices.getDNSStatus(domainName), DomainServices.getPaymentStatus(this._id), DomainServices.getAvailability(domainName)])
		.then(Meteor.bindEnvironment(values => {
			console.log("this", this);
			console.log("SUCCESS: PROMISES");

			// const dnsStatus = values[0];
			// console.log("dnsStatus", dnsStatus);
			const paymentStatus = values[1];
			console.log("paymentStatus", paymentStatus);
			const availability = DomainServices.parseAvailabilityResponse(values[2]);
			console.log("availability", availability);

			if (availability.available) {
				this.update({$set: {'editing.domain.label': `available for $${availability.price}`}});
			}

		}))
		.catch(DomainServices.parseError)
	},
	update(data) {
		check(data, { // Overwriting protection
			$set: Match.Maybe(Object)
		})
		return SitesCollection.update(this._id, data);
	}
});

Meteor.startup(() => {
	console.log("---------------------------------");
	console.log("");
	Sites.findOne('google.com').updateDomainStatus()
})