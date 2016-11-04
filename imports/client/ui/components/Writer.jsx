import React from 'react';
import {Meteor} from 'meteor/meteor';
import '/imports/G.js';
import Marked from './Marked.jsx';
import DomainInput from './DomainInput.jsx';
import Textarea from 'react-autosize-textarea';
import Alert from 'react-s-alert';

export default class extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			showPreview: false,
			domain: G.ifDefined(this, "props.site.domain", ""),
			email: G.ifDefined(this, "props.site.email", ""),
			content: G.ifDefined(this, "props.site.content", "")
		};

		this.handleChange = this.handleChange.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
		this.saveAndPublish = this.saveAndPublish.bind(this);
	}

	handleChange(e) {
		this.setState({[e.target.name]: e.target.value});
	}

	saveAndPublish() {
		const siteId = G.ifDefined(this, "props.site._id");
		let data = {
			domain: this.state.domain,
			email: this.state.email,
			content: this.state.content
		};
		Meteor.call('sites.upsert', siteId, data, function(err, result){
			if (err)
				Alert.error(err.message);
			else {
				if (result.siteId) {
					FlowRouter.go('writer', {siteId: result.siteId, pageName: "writer"});
				}
			}
		});
	}

	render() {
		let preview = this.state.showPreview;
		return (<div className="writer relative">
				<div className="ui form">
					<div className="fields">
						<div className="field">
							<label>Domain</label>
							<input type="text" value={this.state.domain} name="domain" onChange={this.handleChange}/>
						</div>
						<div className="field">
							<label>Owners email</label>
							<input type="text" value={this.state.email} name="email" onChange={this.handleChange}/>
						</div>
						<div className="field">
							<label>&nbsp;</label>
							<button className="ui button primary" onClick={this.saveAndPublish}>Save and Publish</button>
						</div>
					</div>
					<div className="field relative">
						<label>Markdown <span className="see-through text-normal">(hold alt for preview)</span></label>
						<Textarea
							className={"w100 padding bbb" + (preview ? ' transparent' : '')}
							name="content"
							value={this.state.content}
							autoFocus={true}
							rows={5}
							onChange={this.handleChange}
						/>
						{preview ? <div className="absolute w100 top0"><Marked content={this.state.content}/></div> : null}
					</div>
				</div>
			</div>
		)
	}

	componentDidMount() {
		_this = this;
		// Alt preview
		$(document).keydown((e) => {
			if (e.which === 18) {
				_this.setState({showPreview: true});
			}
		});
		$(document).keyup((e) => {
			if (e.which === 18) {
				_this.setState({showPreview: false});
			}
		});
	}

}