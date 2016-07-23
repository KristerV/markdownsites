import React from 'react';
import Checkout from '2checkout-node';

export default class extends React.Component {

	constructor(props) {
		super(props);
		this.tco = new Checkout({
			sellerId: "901324011",
			privateKey: "F2917089-D490-4180-B97C-404B376DA03A",     // Payment API private key, required for checkout.authorize binding
			secretWord: "tango",                                    // Secret Word, required for response and notification checks
			demo: true,                                             // Set to true if testing response with demo sales
			sandbox: true                                          // Uses 2Checkout sandbox URL for all bindings
		})
		this.goCheckout = this.goCheckout.bind(this);
	}

	goCheckout() {
		console.log("TwoCheckout.jsx:16 goCheckout()");
		const params = {
			"merchantOrderId": "123",
			"token": "MWQyYTI0ZmUtNjhiOS00NTIxLTgwY2MtODc3MWRlNmZjY2Jh",
			"currency": "USD",
			"total": "10.00",
			"billingAddr": {
				"name": "Testing Tester",
				"addrLine1": "123 Test St",
				"city": "Columbus",
				"state": "Ohio",
				"zipCode": "43123",
				"country": "USA",
				"email": "example@2co.com",
				"phoneNumber": "5555555555"
			}
		};
		this.tco.checkout.authorize(params, function (error, data) {
			console.log("TwoCheckout.jsx:34 ()");
			if (error) {
				console.log(error.message);
			} else {
				console.log(JSON.stringify(data));
			}
		});
	}

	render() {
		if (!this.props.domain)
			return <div></div>
		return (
			<button onClick={this.goCheckout}>CHECKOUT: {this.props.domain}</button>
		)
	}

}