import React from 'react';

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
		this.handleAvailabilityResponse = this.handleAvailabilityResponse.bind(this);
		this.update = this.update.bind(this);
		this.checkDomain = this.checkDomain.bind(this);
	}

	componentDidMount() {
		this.checkDomain(this.state.domain);
	}

	update(e, callback) {
		let data = {domain: e.target.value};
		Meteor.call("sites.upsert", this.props.siteId, data, Sites.useResults);
	}

	handleChange(e) {
		const val = e.target.value;
		this.setState({domain: val});
		this.checkDomain(val)
	}

	checkDomain(domain) {
		this.setState({status: null});
		this.setState({msg: null});

		// if http or slash, give warning
		if (domain.match('http|\/'))
			this.setState({msg: "No need for http or slashes, just the domain."});

		// no strange characters and valid domain extension
		if (!domain.match('[^a-zA-Z0-9\\-\\.]') && domain.match('\\.[a-zA-Z]{2,}$')) {
			this.setState({status: "checking"});
			Meteor.call('domain.isAvailable', domain, this.handleAvailabilityResponse);
		}
	}

	handleAvailabilityResponse(err, res) {

		// If domain has changed already
		if (err || res.domain !== this.state.domain)
			return;

		// Success
		if (!err && res.result === 1) {
			this.setState({status: res.available ? "available" : "taken"});
			this.setState({price: res.price});
		// Fail
		} else if (!err && res.result === 0) {
			this.setState({msg: res.msg});
		}
	}

	render() {
		let button = null;
		switch (this.state.status) {
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
				button = <button className="ui positive button">
					Available for ${this.state.price} a year
				</button>;
				break;
			case "purchased":
				button = <button className="ui yellow basic button">
					Purchased, waiting for DNS
				</button>;
				break;
			case "connected":
				button = <button className="ui positive basic button">
					connected
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
					<input type="text" value={this.state.domain} name="domain" onBlur={this.update} onChange={this.handleChange}/>
					{button}
				</div>
				{/*<Payment domain={G.ifDefined(this, 'props.site.editing.domain')}/>*/}
				<p>{this.state.msg}</p>
			</div>
		)
	}

}