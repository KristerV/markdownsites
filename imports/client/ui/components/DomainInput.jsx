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
		const steps = G.ifDefined(this, "props.domainPurchase.steps");
		const currentStep = steps ? steps[steps.length-1] : "undefined";
		switch (currentStep) {
			/*case "checking":
				button = <button className="ui basic button">
					checking domain..
				</button>;
				break;
			case "confirmingPayment":
				button = <button className="ui button basic" onClick={this.startNextStep}>
					Confirming payment
				</button>;
				break;
			case "settingDNS":
				button = <button className="ui button basic" onClick={this.startNextStep}>
					Setting up domain
				</button>;
				break;
			case "unknownPaymentStatus":
				button = <button className="ui negative button" onClick={this.startNextStep}>
					Unknown payment status
				</button>;
				break;
			case "notValidDomainName":
				button = <button className="ui negative button basic" onClick={this.startNextStep}>
					domain not valid
				</button>;
				break;
			case "slashes":
				button = <button className="ui negative button basic" onClick={this.startNextStep}>
					No http or /
				</button>;
				break;
			case "takenLocally":
				button = <button className="ui negative button basic" onClick={this.startNextStep}>
					Already registered here
				</button>;
				break;
			case "connected":
				button = <button className="ui positive button basic" onClick={this.startNextStep}>
					Domain is connected
				</button>;
				break;
			case "paymentError":
				button = <button className="ui negative button" onClick={this.startNextStep}>
					Payment error
				</button>;
				break;
			case "error":
				button = <button className="ui negative button" onClick={this.startNextStep}>
					error
				</button>;
				break;*/

			case "checkAvailabilityNotAvailable":
				button = <button className="ui negative button basic">
					domain is taken
				</button>;
				break;
			case "checkAvailabilityAvailable":
				button = <button className="ui positive button" onClick={this.startNextStep}>
					Available for ${this.props.extensionAvailability.mdsPrice} a year
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
				button = <button className="ui basic button" onClick={this.startNextStep}>
					{currentStep}
				</button>;
		}

		return (<div className="field">
				<label>Domain</label>
				<div className={"ui input action"}>
					<input type="text" value={this.props.domain} name={this.props.name} onChange={this.props.onChange}/>
					{button}
				</div>
				<Payment domain={this.props.domain} price={99} siteId={this.props.siteId}
						 onPaymentReceived={this.paymentReceived}/>
				<p>{msg}</p>
			</div>
		)
	}

}