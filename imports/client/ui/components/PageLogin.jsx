import React from 'react';
import Marked from './Marked';
import Alert from 'react-s-alert';

export default class extends React.Component {

	constructor(props) {
		super(props);
		this.getLoginLink = this.getLoginLink.bind(this);
	}

	getLoginLink(e, dunno, e2) {
		e.preventDefault();
		const email = $('#loginform').serializeArray()[0].value;
		Meteor.call('sendEmailLogin', email, function(err, res){
			if (err) {
				$('#loginform button').text(err.reason).addClass('basic').addClass('red').removeClass('blue');
			} else {
				$('#loginform button').text("Email sent").addClass('basic');
				$('#loginform input').val('');
			}
			Meteor.setTimeout(() => {
				$('#loginform button').text("Get login link").removeClass('basic').removeClass('red').addClass('blue');
			}, 3000);
		});
	}

	render() {
		return (<div>
			<h1>Login</h1>
			<p>Just enter your email and we'll send you a magic link. No need to remember any passwords here.</p>
			<form className="ui form" onSubmit={this.getLoginLink} id="loginform">
				<div className="fields">
					<div className="field">
						<label>Your email</label>
						<input type="text" name="email"/>
					</div>
					<div className="field">
						<label>&nbsp;</label>
						<button type="submit" className="ui button blue">Get login link
						</button>
					</div>
				</div>
			</form>
		</div>)
	}

};