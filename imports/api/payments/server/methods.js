import '/imports/G.js';
import {braintreGateway} from './initBraintree.js';


Meteor.methods({
	'braintree-webhooks'(a, b, c) {
		console.log("braintree-webhooks");
		console.log(a);
		console.log(b);
		console.log(c);
	},
	'payment.getClientToken'() {
		var createToken = Meteor.wrapAsync(braintreGateway.clientToken.generate, braintreGateway.clientToken);
		var response = createToken({});
		return response.clientToken;
	},
	'payment.received'(siteId, domain, payload) {
		console.log("methods.js:20 'payment.received'()");
		check(siteId, String);
		check(domain, String);
		check(payload, Object);
		let data = {
			domainName: domain,
			siteId,
			initialPayment: payload
		};
		PaymentsCollection.upsert({domainName: domain}, {$set: data});
		Sites.findOne(siteId).updateDomainStatus();
	},
	'payment.noncePayment'(payload, siteId) {
		console.log("methods.js:32 'payment.noncePayment'()");
		let nonce = payload.nonce;
		check(nonce, String);
		check(siteId, String);

		const site = SitesCollection.findOne(siteId);
		const domain = G.ifDefined(site, 'editing.domain.name');
		const price = DomainsCollection.findOne({name: G.getDomainExtension(domain)}).mdsPrice;

		// For testing
		nonce = 'fake-valid-nonce'; // A valid nonce that can be used to create a transaction
		// nonce = 'fake-valid-no-billing-address-nonce'; // A valid nonce containing no billing address information
		// nonce = 'fake-valid-visa-nonce'; // A nonce representing a valid Visa card request
		// nonce = 'fake-valid-amex-nonce'; // A nonce representing a valid American Express card request
		// nonce = 'fake-valid-mastercard-nonce'; // A nonce representing a valid Mastercard request
		// nonce = 'fake-valid-discover-nonce'; // A nonce representing a valid Discover card request
		// nonce = 'fake-valid-jcb-nonce'; // A nonce representing a valid JCB card request
		// nonce = 'fake-valid-maestro-nonce'; // A nonce representing a valid Maestro card request
		// nonce = 'fake-valid-dinersclub-nonce'; // A nonce representing a valid Diners Club card request
		// nonce = 'fake-valid-prepaid-nonce'; // A nonce representing a valid prepaid card request
		// nonce = 'fake-valid-commercial-nonce'; // A nonce representing a valid commercial card request
		// nonce = 'fake-valid-durbin-regulated-nonce'; // A nonce representing a valid Durbin regulated card request
		// nonce = 'fake-valid-healthcare-nonce'; // A nonce representing a valid healthcare card request
		// nonce = 'fake-valid-debit-nonce'; // A nonce representing a valid debit card request
		// nonce = 'fake-valid-payroll-nonce'; // A nonce representing a valid payroll card request
		console.log("payment nonce 1");

		braintreGateway.transaction.sale({
			amount: price,
			paymentMethodNonce: nonce,
			orderId: `${siteId};${domain}`,
			options: {
				submitForSettlement: true
			}
		}, Meteor.bindEnvironment((err, result) => {
			console.log("payment nonce 2");
			if (result) {
				if (result.success) {
					console.log("payment nonce 3");
					result.domainName = domain;
					result.siteId = site._id;
					PaymentsCollection.upsert({domainName: domain}, {$set: result});
				} else {
					console.log("payment nonce 4");
					console.error(result);
				}

			} else {
				console.warning(err)
			}
		}));
	},
});
