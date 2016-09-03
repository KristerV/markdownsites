import bodyParser from 'body-parser';
import {braintreGateway} from './initBraintree.js';

Picker.middleware( bodyParser.json() );
Picker.middleware( bodyParser.urlencoded( { extended: false } ) );

Picker.route( '/braintree-webhooks', function( params, req, res, next ) {
	console.log(" ---------------- Braintree webhook ---------------- ");
	console.log(params);
	console.log(req.body);
	braintreGateway.webhookNotification.parse(
		req.body.bt_signature,
		req.body.bt_payload,
		function (err, webhookNotification) {
			console.log("[Webhook Received " + webhookNotification.timestamp + "] | Kind: " + webhookNotification.kind);
			console.log(webhookNotification);
		}
	);
	res.status(200).send();
});