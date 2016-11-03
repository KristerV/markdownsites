import React from 'react';
import {DropIn} from 'braintree-react';
import Braintree from 'braintree-web';

export default class extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			clientToken: null
		};
		this._isMounted = false;
		this.onPaymentMethodReceived = this.onPaymentMethodReceived.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;
		Meteor.call('payment.getClientToken', (err, res) => {
			if (err)
				console.error(err);
			else if (this._isMounted)
				this.setState({clientToken: res});
		});
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	onPaymentMethodReceived(payload) {
		Meteor.call('payment.received', this.props.siteId, this.props.domain, payload)
		Meteor.call('payment.noncePayment', payload, this.props.siteId);
		$('#payment-modal').modal('hide');
		this.props.onPaymentReceived();
	}

	render() {
		if (!this.props.domain || !this.props.siteId)
			return <div></div>;
		return (<div className="ui modal small" id="payment-modal">
			<i className="close icon"></i>
			<div className="content">
				<form action='/transactions' method='POST'>
					{this.state.clientToken ?
						<DropIn
							braintree={Braintree}
							clientToken={this.state.clientToken}
							onPaymentMethodReceived={this.onPaymentMethodReceived.bind(this)}
						/>
					:
						null
					}
					<br/>
					<div className="actions">
						<div className="ui basic deny button">
							Cancel
						</div>
						<button type="submit" className="ui right green labeled icon button">
							Buy {this.props.domain} for ${this.props.price}
							<i className="checkmark icon"></i>
						</button>
					</div>
				</form>
			</div>
		</div>
		)
	}

}