import React from 'react';
import Payment from './Payment.jsx';
import '/imports/api/ExtensionsAvailable/main.js';
import Loader from './Loader.jsx';

export default class extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			msg: null,
		};
		this.showPaymentModal = this.showPaymentModal.bind(this);
	}

	showPaymentModal() {
		$('#payment-modal').modal('show');
	}

	render() {
		let button = null;
		console.log(this.props);
		const price = this.props.extensionAvailability;
		return(<div>STOP</div>)
		switch (G.ifDefined(site, 'editing.domain.status')) {
			case "checking":
				button = <button className="ui basic button">
					checking domain..
				</button>;
				break;
			case "notAvailable":
				button = <button className="ui negative button basic">
					domain is taken
				</button>;
				break;
			case "available":
				button = <button className="ui positive button" onClick={this.showPaymentModal}>
					Available for ${price} a year
				</button>;
				break;
			case "confirmingPayment":
				button = <button className="ui button basic" onClick={this.showPaymentModal}>
					Confirming payment
				</button>;
				break;
			case "settingDNS":
				button = <button className="ui button basic" onClick={this.showPaymentModal}>
					Setting up domain
				</button>;
				break;
			case "unknownPaymentStatus":
				button = <button className="ui negative button" onClick={this.showPaymentModal}>
					Unknown payment status
				</button>;
				break;
			case "notValidDomainName":
				button = <button className="ui negative button basic" onClick={this.showPaymentModal}>
					domain not valid
				</button>;
				break;
			case "slashes":
				button = <button className="ui negative button basic" onClick={this.showPaymentModal}>
					No http or /
				</button>;
				break;
			case "takenLocally":
				button = <button className="ui negative button basic" onClick={this.showPaymentModal}>
					Already registered here
				</button>;
				break;
			case "connected":
				button = <button className="ui positive button basic" onClick={this.showPaymentModal}>
					Domain is connected
				</button>;
				break;
			case "paymentError":
				button = <button className="ui negative button" onClick={this.showPaymentModal}>
					Payment error
				</button>;
				break;
			case "error":
				button = <button className="ui negative button" onClick={this.showPaymentModal}>
					error
				</button>;
				break;
			default:
				button = <button className="ui basic button">
					no domain connected
				</button>;
				break;
		}

		return (<div className="field">
				<label>Domain</label>
				<div className={"ui input action"}>
					<input type="text" value={this.props.domain} name={this.props.name} />
					{button}
				</div>
				<Payment domain={this.props.domain} price={price} siteId={this.props.site._id}
						 onPaymentReceived={this.paymentReceived}/>
				<p>{this.state.msg}</p>
			</div>
		)
	}

}