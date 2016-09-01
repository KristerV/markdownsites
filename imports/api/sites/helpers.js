import '../payments/main.js';
import '../domainTransactions/main.js';

SitesCollection.helpers({
	updateDomainStatus() {
		// Only update if domain is valid
		if () {
			
		}
		
		console.log("Checking 1")
		if (Meteor.isClient) { // API keys are only on server
			console.log("Checking 2")
			Meteor.call('sites.updateDomainStatus', this._id);
			return;
		}
		console.log("Checking 3")

		const site = this;

		const domainName = site.editing.domain.name;
		console.log("Checking 4")
		if (!domainName || G.getDomainExtension(domainName).length <= 1)
			site.domainStatus('notValidDomain');

		const payment = PaymentsCollection.findOne({domain: domainName});
		const purchase = DomainTransactionsCollection.findOne({domain: domainName})
		console.log("Checking 5")

		site.domainStatus('checking');
		if (payment) { // domain paid for
			console.log("Checking 6")
			if (payment.siteId === site._id) { // user owns domain
				console.log("Checking 7")
				if (purchase) { // namecheap processed
					console.log("Checking 8")
					site.domainStatus('connected');
				} else {
					console.log("Checking 9")
					site.domainStatus('paidNotBought');
				}
			} else {
				console.log("Checking 10")
				site.domainStatus('notAvailable');
			}
			console.log("Checking 11")
		} else if (purchase) {
			console.log("Checking 12")
			site.domainStatus('notAvailable');
		} else {
			console.log("Checking 13")
			DomainServices.getAvailability(domainName)
				.then(Meteor.bindEnvironment(data => {
					console.log("Checking 14")

					const availability = DomainServices.parseAvailabilityResponse(data);

					if (availability.available) {
						console.log("Checking 15")
						site.update({$set: {'editing.domain.price': availability.price}});
						site.domainStatus('available');
					} else {
						console.log("Checking 16")
						site.domainStatus('notAvailable');
					}

				}))
				.catch(DomainServices.parseError);
			console.log("Checking 17")
		}

	},
	update(data) {
		check(data, { // Overwriting protection
			$set: Match.Maybe(Object)
		})
		return SitesCollection.update(this._id, data);
	},
	buyDomain() {
		const siteId = this._id;
		if (Meteor.isClient) { // API keys are only on server
			Meteor.call('sites.buyDomain', siteId);
			return;
		}
		DomainServices.buyDomain(siteId)
			.then(Meteor.bindEnvironment(data => {
				let response = data.response[0].DomainCreateResult[0].$
				response.siteId = siteId;
			})).catch(data => console.error(data))
	},
	domainStatus(status) {
		check(status, String);
		return this.update({$set: {'editing.domain.status': status}})
	}
});