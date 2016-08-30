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
		Promise.all([DomainServices.getDNSStatus(domainName), DomainServices.getPaymentStatus(this._id), DomainServices.getAvailability(domainName)])
		.then(Meteor.bindEnvironment(values => {

			// const dnsStatus = values[0];
			const paymentStatus = values[1];
			const availability = DomainServices.parseAvailabilityResponse(values[2]);

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
	},
	buyDomain() {
		console.log("helpers.js:37 buyDomain()");
		if (Meteor.isClient) { // API keys are only on server
			Meteor.call('sites.buyDomain', this._id);
			return;
		}
		console.log("helpers.js:42 buyDomain()");
		DomainServices.buyDomain(this._id)
			.then(Meteor.bindEnvironment(data => {
				console.log("DOMAIN BOUGHT");
				console.log(data);
			})).catch(data => console.error(data))
	}
});