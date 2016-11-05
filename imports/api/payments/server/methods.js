import '/imports/G.js';
import {braintreGateway} from '/imports/server/services/BraintreeServices';
import DomainPurchaseService from '/imports/server/services/DomainPurchaseService';

Meteor.methods({
	'braintree-webhooks'(a, b, c) {
		log.warn('braintree-webhooks', {a, b, c});
	},
	'payment.getClientToken'() {
		log.debug('payment.getClientToken');
		var createToken = Meteor.wrapAsync(braintreGateway.clientToken.generate, braintreGateway.clientToken);
		var response = createToken({});
		log.info('payment.getClientToken DONE', {response});
		return response.clientToken;
	},
	'payment.noncePayment'(payload, siteId, domain) {
		DomainPurchaseService.setStep(domain, siteId, 'noncePaymentStart');
		let nonce = payload.nonce;
		log.debug("BRAINTREE process payment1", {domain, siteId});
		check(nonce, String);
		check(siteId, String);
		check(domain, String);

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

		const price = ExtensionsAvailableCollection.findOne({name: G.getDomainExtension(domain)}).mdsPrice;
		const options = {
			amount: price,
			paymentMethodNonce: nonce,
			orderId: `${siteId};${domain}`,
			options: {
				submitForSettlement: true
			}
		}
		log.debug("BRAINTREE process payment2", {siteId, options});
		braintreGateway.transaction.sale(options,
			Meteor.bindEnvironment((err, result) => {
			if (err) {
				DomainPurchaseService.setStep(domain, siteId, "noncePaymentError");
				log.error("BRAINTREE sale error1", err);
			} else if (result && result.success !== true) {
				DomainPurchaseService.setStep(domain, siteId, "noncePaymentError");
				log.error("BRAINTREE sale error2", {msg: result.message, result});
			} else {
				log.info("BRAINTREE sale DONE", result);
				DomainPurchaseService.setStep(domain, siteId, "noncePaymentDone");
				DomainPurchasesCollection.update({domain, siteId}, {$set: {transactionResult: result}});
				DomainPurchaseService.startNextStep(domain, siteId);
			}
		}));
	},
});
