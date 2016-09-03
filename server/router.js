import bodyParser from 'body-parser';

Picker.middleware( bodyParser.json() );
Picker.middleware( bodyParser.urlencoded( { extended: false } ) );

Picker.route( '/braintree-webhooks', function( params, request, response, next ) {
	console.log(" ---------------- Braintree webhook ---------------- ");
	console.log(params);
	console.log(request.body);
	response.end('nothing');
});