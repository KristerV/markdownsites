import React from 'react';

export default class extends React.Component {

	updateValues(e) {
		Meteor.call('sites.update', this.props.site._id, {[e.target.name]: e.target.value})
	}

	render() {
		return (
			<div>
				<p>domain</p>
				<input defaultValue={this.props.site.domain} name="domain" onBlur={this.updateValues.bind(this)}/>
				<p>Change owner</p>
				<input type="email" defaultValue={this.props.site.email} name="email" onBlur={this.updateValues.bind(this)}/>
			</div>
		)
	}

}