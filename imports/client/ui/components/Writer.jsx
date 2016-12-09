import React from 'react';
import { Meteor } from 'meteor/meteor';
import '/imports/G.js';
import Marked from './Marked.jsx';
import DomainInputContainer from './DomainInputContainer.jsx';
import Textarea from 'react-autosize-textarea';
import Alert from 'react-s-alert';
import Introduction from './Introduction';
import MediumEditor from './MediumEditor';

export default class extends React.Component {

	constructor(props) {
		super(props);

		let state = {
			domain: G.ifDefined(this, 'props.site.domain', ""),
			email: G.ifDefined(this, 'props.site.email', ""),
			content: G.ifDefined(this, 'props.site.content', "")
		}

		const user = Meteor.user();
		if (user && user.getEmail())
			state.email = user.getEmail();

		this.state = state;
		this.MediumEditor;

		this.handleChange = this.handleChange.bind(this);
		this.saveAndPublish = this.saveAndPublish.bind(this);
		this.handleTextChange = this.handleTextChange.bind(this);
	}

	handleChange(e) {
		this.setState({[e.target.name]: e.target.value});
	}

	handleTextChange(text) {
		this.setState({"content": text});
	}

	saveAndPublish() {
		const siteId = G.ifDefined(this, "props.site._id");
		let data = {
			domain: this.state.domain,
			email: this.state.email,
			content: this.state.content
		};
		Meteor.call('sites.upsert', siteId, data, function(err, result) {
			if (err)
				Alert.error(err.message);
			else {
				Alert.success("saved");
				if (result.siteId) {
					FlowRouter.go('writer', {siteId: result.siteId, pageName: "writer"});
				}
			}
		});
	}

	render() {
		const siteId = G.ifDefined(this, 'props.site._id');
		const contentText = G.ifDefined(this, 'props.site.content');
		const defaultText = `# Publish your website in 5 minutes

1. **Write your website in simple text.** Go ahead, change this text!
1. **Buy a domain** and your website is online!
1. Just make sure to enter your email so you can come back and edit later.

What's this place for? Well we've all got a few good website ideas that we're left on the back shelf, because it takes time and effort to make anything worth while, right? Well I'm here to tell you you can get a lot done with just writing the first version in text. This service is the easiest way to get an informational website online. Get traction first and improve it later. Have you got a few minutes?`;
		return (<div className="writer relative">
				<div className="ui form">
					<div className="fields">
						<DomainInputContainer domain={this.state.domain} onChange={this.handleChange} name="domain"
											  siteId={siteId} saveChanges={this.saveAndPublish}/>
						<div className="field">
							<label>Your email</label>
							<input type="text" value={this.state.email} name="email" onChange={this.handleChange}/>
						</div>
						<div className="field">
							<label>&nbsp;</label>
							<button className="ui button primary" onClick={this.saveAndPublish}>Save and Publish
							</button>
						</div>
					</div>
					<div className="field relative">
						<label>Website content <span className="text-normal">(
							<a target="_blank" href={"/" + (siteId || "")}>see live website</a>
							)</span></label>
						<div className="overwrite-meduim-editor">
							<MediumEditor onChange={this.handleTextChange} markdown={contentText || defaultText}/>
						</div>
					</div>
					{!contentText ? <div className="field relative"><Introduction/></div> : null}
				</div>
			</div>
		)
	}

}