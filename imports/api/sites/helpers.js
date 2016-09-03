import '../payments/main.js';
import '../domainTransactions/main.js';

SitesCollection.helpers({
	updateDomainStatus() {
		
		if (Meteor.isClient) { // API keys are only on server
			Meteor.call('sites.updateDomainStatus', this._id);
			return;
		}

		const site = this;

		const domainName = site.editing.domain.name;
		if (!domainName) {
			site.domainStatus(null);
			return;
		}

		// Only update if domain is valid
		if (domainName.match('http|\/')) {
			this.domainStatus('slashes');
			return;
		}

		// Don't bother if there is no dot (for extension)
		if (!domainName.match('\\.')) {
			this.domainStatus(null);
			return;
		}

		// no strange characters and valid domain extension
		if (domainName.match('[^a-zA-Z0-9\\-\\.]') || !domainName.match('\\.[a-zA-Z]{2,}$')) {
			this.domainStatus('notValidDomainName');
			return;
		}

		const payment = PaymentsCollection.findOne({domainName: domainName});
		const purchase = DomainTransactionsCollection.findOne({domain: domainName})

		site.domainStatus('checking');
		site.domainMsg('');
		if (payment) { // domain paid for
			if (payment.siteId === site._id) { // user owns domain
				if (purchase) { // namecheap processed
					site.domainStatus('connected');
				} else {
					if (payment.transaction.status === 'submitted_for_settlement')
						site.domainStatus('confirmingPayment');
					else if (payment.transaction.status === 'settled')
						site.domainStatus('settingDNS');
					else
						site.domainStatus('unknownPaymentStatus');
				}
			} else {
				site.domainStatus('notAvailable');
			}
		} else if (purchase) {
			site.domainStatus('notAvailable');
		} else {
			DomainServices.getAvailability(domainName)
				.then(Meteor.bindEnvironment(data => {
					
					const availability = DomainServices.parseAvailabilityResponse(data);

					const updatedSite = Sites.findOne(site._id);
					if (availability.domain !== updatedSite.editing.domain.name) {
						return; // User is searching for new domain already
					}

					if (availability.available) {
						site.update({$set: {'editing.domain.price': availability.price}});
						site.domainStatus('available');
					} else {
						site.domainStatus('notAvailable');
					}

				}))
				.catch(Meteor.bindEnvironment(data => {
					const result = DomainServices.parseError(data);
					site.update({$set: {'editing.domain.msg': result.msg}});
					site.domainStatus('error');
				}));
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
		check(status, Match.Maybe(String));
		return this.update({$set: {'editing.domain.status': status}})
	},
	domainMsg(msg) {
		check(msg, String);
		return this.update({$set: {'editing.domain.msg': msg}})
	}
});