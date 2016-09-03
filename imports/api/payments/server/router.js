import bodyParser from 'body-parser';
import {braintreGateway} from './initBraintree.js';
import braintree from 'braintree';

Picker.middleware( bodyParser.json() );
Picker.middleware( bodyParser.urlencoded( { extended: false } ) );

Picker.route( '/braintree-webhooks', function( params, req, res, next ) {
	console.log(" ---------------- Braintree webhook ---------------- ");
	console.log(params);
	console.log(req.body);
	if (!req.body.bt_signature || !req.body.bt_payload) {
		res.end('Not braintree signature')
		return;
	}
	braintreGateway.webhookNotification.parse(
		req.body.bt_signature,
		req.body.bt_payload,
		function (err, wh) {
			console.log(wh);
			if (wh.kind === 'transaction_disbursed') {
				console.log(" ------- IS DISBURSEMENT ------- ");
				PaymentsCollection.update({'transaction.id': wh.transaction.id}, {$set: {disbursment: wh}});
				const paym = PaymentsCollection.findOne({'transaction.id': wh.transaction.id});
				if (!paym) {
					console.error('Braintree webhook trying to confirm non-existent payment:', wh);
					return;
				}
				Meteor.call('payments.transactionConfirmed', `${paym.siteId};${paym.domainName}`);
				DomainServices.buyDomain(paym.domainName, paym.siteId);
			} else {
				console.error(" ------------------- UNKNOWN KIND OF NOTIFICATION ------------------- ");
				console.error(wh);
			}
		}
	);
	res.status(200).send();
});