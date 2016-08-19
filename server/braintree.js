import util from 'util';
import braintree from 'braintree';
import '/imports/G.js';

const braintreGateway = braintree.connect({
	environment: braintree.Environment.Sandbox,
	merchantId: G.getEnv('BRAINTREE_MERCHANT_ID'),
	publicKey: G.getEnv('BRAINTREE_PUBLIC_KEY'),
	privateKey: G.getEnv('BRAINTREE_PRIVATE_KEY'),
});

Meteor.methods({
	'braintree-webhooks'(a, b) {
		console.log("braintree-webhooks");
		console.log(a);
		console.log(b);
	},
	'braintree.noncePayment'(payload, siteId) {
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

		braintreGateway.transaction.sale({
			amount: price,
			paymentMethodNonce: nonce,
			options: {
				submitForSettlement: true
			}
		},
			Meteor.bindEnvironment((err, result) => {
			if (result) {
				if (result.success) {
					SitesCollection.update(siteId, {
						$set: {'editing.domain.isPaymentSent': true},
						$addToSet: {payments: result.transaction.id}
					});
				} else {
					console.warning(result.message)
				}
			} else {
				console.warning(err)
			}
		}));
	}
});

/*
Meteor.startup(() => {
	Meteor.call('braintree.noncePayment', {nonce: 'fake-valid-nonce'}, "FYhtwTgfBfCzaXBNn");
})*/