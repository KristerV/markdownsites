import React from 'react';

export default class extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			msg: null,
			domain: this.props.domain || ""
		}
		this.handleChange = this.handleChange.bind(this)
		this.update = this.update.bind(this)
	}

	update(e, callback) {
		let data = {domain: e.target.value};
		Meteor.call("sites.upsert", this.props.siteId, data, Sites.useResults);
	}

	handleChange(e) {
		const val = e.target.value;
		this.setState({domain: val});

		// if http or slash, give warning
		if (val.match('http|\/'))
			this.setState({msg: "No need for http or slashes, just the domain."});

		// no strange characters and valid domain extension
		if (!val.match('[^a-zA-Z0-9\\-\\.]') && val.match('\\.[a-zA-Z]{2,}$')) {
			this.setState({msg: "Checking availability"});
			Meteor.call('domain.isAvailable', this.props.siteId, val, (err, res) => {

				// If domain has changed already
				if (err || res.domain !== this.state.domain)
					return

				// Success
				if (!err && res.result === 1) {
					this.setState({msg: res.available ? `${res.domain} is available` : `${res.domain} is taken`});

				// Fail
				} else if (!err && res.result === 0) {
					this.setState({msg: res.msg});
				}
			});
		}

		else
			this.setState({msg: null});
	}

	render() {
		return (<div className="field">
				<label>Domain</label>
				<input value={this.state.domain} name="domain" onBlur={this.update} onChange={this.handleChange}/>
				{/*<Payment domain={G.ifDefined(this, 'props.site.editing.domain')}/>*/}
				<p>{this.state.msg}</p>
			</div>
		)
	}

}