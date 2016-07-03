import React from 'react';
import Alert from 'react-s-alert';

export default class extends React.Component {

	updateValues(e) {
		Meteor.call('sites.update', this.props.site._id, {[e.target.name]: e.target.value}, (err, res) => {
			if (err)
				Alert.error(err.reason);
			else if (res)
				Alert.success("Update successful")
		})
	}

	render() {
		return (
			<div>
				<p>domain</p>
				<input defaultValue={this.props.site.domain} name="domain" onBlur={this.updateValues.bind(this)}/>
				<p>Change owners email</p>
				<input type="email" defaultValue={this.props.site.email} name="email" onBlur={this.updateValues.bind(this)}/>
			</div>
		)
	}

}