import React from 'react';
import Payment from './Payment.jsx';
import '/imports/api/ExtensionsAvailable/main.js';
import Loader from './Loader.jsx';
import Alert from 'react-s-alert';

export default class extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			msg: null,
		};
		this.showPaymentModal = this.showPaymentModal.bind(this);
		this.startNextStep = this.startNextStep.bind(this);
	}

	showPaymentModal() {
		$('#payment-modal').modal('show');
	}

	startNextStep() {
		const domain = this.props.domain;
		const siteId = this.props.siteId;
		if (domain && siteId) {
			this.props.saveChanges();
			Meteor.call('DomainPurchases.startNextStep', domain, siteId);
		}
		else if (!siteId)
			Alert.info("Save site first");
		else
			Alert.info("Write a domain maybe?");
	}

	render() {
		console.log(this.props);
		let button = null;
		let msg = "";
		const price = G.ifDefined(this, "props.extensionAvailability.mdsPrice", "error");
		const steps = G.ifDefined(this, "props.domainPurchase.steps");
		const currentStep = steps ? steps[steps.length-1] : "undefined";
		switch (currentStep) {
			/*
			case "notValidDomainName":
				button = <button className="ui negative button basic" onClick={this.startNextStep}>
					domain not valid
				</button>;
				break;
			case "slashes":
				button = <button className="ui negative button basic" onClick={this.startNextStep}>
					No http or /
				</button>;
				break;*/

			case "setHostsError":
				button = <button className="ui negative button">
					DNS settings failed
				</button>;
				msg = "Please contact support";
				break;
			case "setHostsDone":
				button = <button className="ui button basic">
					DNS settings complete
				</button>;
				break;
			case "setHostsStart":
				button = <button className="ui button basic">
					Setting up DNS
				</button>;
				break;
			case "buyDomainWithoutTransactionError":
				button = <button className="ui negative button">
					Payment hasn't gone through
				</button>;
				msg = "You may want to contact support";
				break;
			case "buyDomainDone":
				button = <button className="ui button basic">
					Registering complete...
				</button>;
				break;
			case "buyDomainStart":
				button = <button className="ui button basic">
					Registering domain...
				</button>;
				break;
			case "noncePaymentDone":
				button = <button className="ui button basic">
					Payment received...
				</button>;
				break;
			case "noncePaymentStart":
				button = <button className="ui button basic">
					Processing payment...
				</button>;
				break;
			case "noncePaymentError":
				button = <button className="ui button basic">
					Technical error
				</button>;
				msg = "Payment did not go through."
				break;
			case "checkAvailabilityNotAvailable":
				button = <button className="ui negative button basic">
					domain is taken
				</button>;
				break;
			case "checkAvailabilityAvailable":
				button = <button className="ui positive button" onClick={this.showPaymentModal}>
					Available for ${price} a year
				</button>;
				break;
			case "checkAvailabilityError":
				button = <button className="ui negative button" onClick={this.startNextStep}>
					{this.props.domainPurchase.title}
				</button>;
				msg = this.props.domainPurchase.msg;
				break;
			case "undefined":
				button = <button className="ui basic button" onClick={this.startNextStep}>
					check availability
				</button>;
				break;
			case "checkAvailabilityStarted":
				button = <button className="ui basic button" onClick={this.startNextStep}>
					checking..
				</button>;
				break;
			default:
				button = <button className="ui button" onClick={this.startNextStep}>
					{currentStep}
				</button>;
		}

		return (<div className="field">
				<label>Domain</label>
				<div className={"ui input action"}>
					<input type="text" value={this.props.domain} name={this.props.name} onChange={this.props.onChange}/>
					{button}
				</div>
				<Payment domain={this.props.domain} price={price} siteId={this.props.siteId}
						 onPaymentReceived={this.paymentReceived}/>
				<p>{msg}</p>
			</div>
		)
	}

}