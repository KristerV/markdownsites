import bodyParser from 'body-parser';
import {braintreGateway} from '/imports/server/services/BraintreeServices';
import NamecheapServices from '../../../server/services/NamecheapServices';

Picker.middleware(bodyParser.json());
Picker.middleware(bodyParser.urlencoded({extended: false}));

Picker.route('/braintree-webhooks', function(params, req, res, next) {
	log.debug(" ---------------- Braintree webhook ---------------- ");
	log.debug(params);
	log.debug(req.body);
	if (!req.body.bt_signature || !req.body.bt_payload) {
		res.end('Not braintree signature')
		return;
	}
	braintreGateway.webhookNotification.parse(
		req.body.bt_signature,
		req.body.bt_payload,
		function(err, wh) {
			log.debug(wh);
			if (wh.kind === 'transaction_disbursed') {
				log.debug(" ------- IS DISBURSEMENT ------- ");
				PaymentsCollection.update({'transaction.id': wh.transaction.id}, {$set: {disbursment: wh}});
				const paym = PaymentsCollection.findOne({'transaction.id': wh.transaction.id});
				if (!paym) {
					log.error('Braintree webhook trying to confirm non-existent payment:', wh);
					return;
				}
				Meteor.call('payments.transactionConfirmed', `${paym.siteId};${paym.domainName}`);
				NamecheapServices.buyDomain(paym.domainName, paym.siteId);
			} else {
				log.error(" ------------------- UNKNOWN KIND OF NOTIFICATION ------------------- ");
				log.error(wh);
			}
		}
	);
	res.status(200).send();
});