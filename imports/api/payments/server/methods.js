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
		// nonce = 'fake-valid-nonce'; // A valid nonce that can be used to create a transaction
		// nonce = 'fake-luhn-invalid-nonce'; //	A nonce representing a Luhn-invalid card
		// nonce = 'fake-consumed-nonce'; //	A nonce that has already been consumed
		// nonce = 'fake-gateway-rejected-fraud-nonce'; //	A fraudulent nonce
		// nonce = 'fake-processor-declined-amex-nonce'; //	A nonce representing a request that was declined by the processor

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
				const details = {msg: result.message};
				DomainPurchaseService.setStep(domain, siteId, "noncePaymentError", details);
				log.error("BRAINTREE sale error2", {msg: result.message, result, details});
			} else {
				log.info("BRAINTREE sale DONE", result);
				DomainPurchaseService.setStep(domain, siteId, "noncePaymentDone");
				DomainPurchasesCollection.update({domain, siteId}, {$set: {transactionResult: result}});
				DomainPurchaseService.startNextStep(domain, siteId);
			}
		}));
	},
});
