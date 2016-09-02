import React from 'react';
import Payment from './Payment.jsx';
import '/imports/api/domains/main.js';
import Loader from './Loader.jsx';

export default class extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			msg: null,
			domain: this.props.domain || "",
			status: null,
			price: null
		};
		this.update = this.update.bind(this);
		this.showPaymentModal = this.showPaymentModal.bind(this);
		this.paymentReceived = this.paymentReceived.bind(this);
	}

	componentDidMount() {
		if (G.isDefined(this, "props.site.updateDomainStatus"))
			this.props.site.updateDomainStatus();
	}

	update(e, callback) {
		const domainName = e.target.value;
		const site = this.props.site;
		if (!domainName.match('[^a-zA-Z0-9\\-\\.]') && domainName.match('\\.[a-zA-Z]{2,}$')) {
			let data = {domainName: domainName};
			Meteor.call("sites.upsert", this.props.site._id, data, Sites.useResults);
		}
	}

	showPaymentModal() {
		$('#payment-modal').modal('show');
	}

	paymentReceived() {
		console.log("DomainInput.jsx:40 paymentReceived()");
	}

	render() {
		if (!this.props.site)
			return <Loader/>
		const site = this.props.site;
		const domain = G.isDefined(site, 'editing.domain') || {};

		let button = null;
		const price = G.ifDefined(this, 'props.site.editing.domain.price');
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
					Payment error
				</button>;
				break;
			case "notValidDomainName":
				button = <button className="ui negative button basic" onClick={this.showPaymentModal}>
					not valid
				</button>;
				break;
			case "slashes":
				button = <button className="ui negative button basic" onClick={this.showPaymentModal}>
					No http or /
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
					<input type="text" defaultValue={domain.name} name="domainName" onBlur={this.update}/>
					{button}
				</div>
				<Payment domain={this.state.domain} price={this.state.price} siteId={this.props.site._id}
						 onPaymentReceived={this.paymentReceived}/>
				<p>{domain.msg}</p>
			</div>
		)
	}

}