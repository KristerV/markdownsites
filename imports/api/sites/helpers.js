import '../payments/main.js';
import '../DomainPurchases/main.js';
import NamecheapServices from '../../server/services/NamecheapServices';

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
		const purchase = DomainPurchasesCollection.findOne({Domain: domainName});

		site.domainStatus('checking');
		site.domainMsg('');
		if (payment) { // domain paid for
			if (payment.siteId === site._id) { // user owns domain
				if (purchase) { // namecheap processed
					site.domainStatus('connected');
				} else if (G.isDefined(payment, 'disbursment')) {
					site.domainStatus('settingDNS');
				} else if (G.isDefined(payment, 'transaction')) {
					site.domainStatus('confirmingPayment');
				} else {
					site.domainStatus('paymentError');
				}
			} else {
				site.domainStatus('notAvailable');
			}
		} else if (purchase) {
			site.domainStatus('notAvailable');
		} else {
			NamecheapServices.getAvailability(domainName)
				.then(Meteor.bindEnvironment(data => {
					
					const availability = NamecheapServices.parseAvailabilityResponse(data);

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
					const result = NamecheapServices.parseError(data);
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
	domainStatus(status) {
		check(status, Match.Maybe(String));
		return this.update({$set: {'editing.domain.status': status}})
	},
	domainMsg(msg) {
		check(msg, String);
		return this.update({$set: {'editing.domain.msg': msg}})
	}
});