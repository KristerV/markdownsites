import React from 'react';
import Payment from './Payment.jsx';
import '/imports/api/domains/Domains.js';
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
		this.handleChange = this.handleChange.bind(this);
		this.update = this.update.bind(this);
		this.checkDomain = this.checkDomain.bind(this);
		this.showPaymentModal = this.showPaymentModal.bind(this);
		this.paymentReceived = this.paymentReceived.bind(this);
	}

	componentDidMount() {
		this.checkDomain(this.state.domain);
	}

	update(e, callback) {
		let data = {domain: e.target.value};
		Meteor.call("sites.upsert", this.props.site._id, data, Sites.useResults);
	}

	handleChange(e) {
		const val = e.target.value;
		this.setState({domain: val});
		this.checkDomain(val)
	}

	checkDomain(domain) {
		this.setState({status: null});
		this.setState({msg: null});
		if (!domain) domain = this.state.domain;

		// if http or slash, give warning
		if (domain.match('http|\/'))
			this.setState({msg: "No need for http or slashes, just the domain."});

		// no strange characters and valid domain extension
		if (!domain.match('[^a-zA-Z0-9\\-\\.]') && domain.match('\\.[a-zA-Z]{2,}$')) {
			this.setState({status: "checking"});
			Meteor.call('domain.isAvailable', domain);
		}
	}

	showPaymentModal() {
		$('#payment-modal').modal('show');
	}

	paymentReceived() {
		console.log("DomainInput.jsx:74 paymentReceived()");
		this.setState({status: 'paymentProcessing'});
		Meteor.call('domain.isConnected', this.props.site._id, (err, res) => {
			if (res)
				this.checkDomain();
			else
				console.error("err", err);
		});
	}

	render() {
		let button = null;
		const price = G.ifDefined(this, 'props.site.editing.domain.price');
		if (!this.props.site)
			return <Loader/>
		console.log("Domains.getStatus()", Domains.getStatus(this.props.site._id));
		switch (Domains.getStatus(this.props.site._id)) {
			case "checking":
				button = <button className="ui basic button">
					checking domain..
				</button>;
				break;
			case "taken":
				button = <button className="ui negative button basic">
					domain is taken
				</button>;
				break;
			case "available":
				button = <button className="ui positive button" onClick={this.showPaymentModal}>
					Available for ${price} a year
				</button>;
				break;
			case "paymentProcessing":
				button = <button className="ui positive button" onClick={this.showPaymentModal}>
					Available for ${price} a year
				</button>;
				break;
			case "paymentCleared":
				button = <button className="ui yellow basic button">
					Purchased, waiting for DNS
				</button>;
				break;
			case "domainBought":
				button = <button className="ui positive basic button">
					Setting up DNS
				</button>;
				break;
			case "domainConnected":
				button = <button className="ui positive basic button">
					Domain is connected
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
					<input type="text" value={this.state.domain} name="domainName" onBlur={this.update}
						   onChange={this.handleChange}/>
					{button}
				</div>
				<Payment domain={this.state.domain} price={this.state.price} siteId={this.props.site._id}
						 onPaymentReceived={this.paymentReceived}/>
				<p>{G.ifDefined(this, 'site.editing.domain.msg')}</p>
			</div>
		)
	}

}