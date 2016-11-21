import React from 'react';
import { Meteor } from 'meteor/meteor';
import '/imports/G.js';
import Marked from './Marked.jsx';
import DomainInputContainer from './DomainInputContainer.jsx';
import Textarea from 'react-autosize-textarea';
import Alert from 'react-s-alert';
import Introduction from './Introduction';

export default class extends React.Component {

	constructor(props) {
		super(props);

		let state = {
			showPreview: false,
			domain: G.ifDefined(this, 'props.site.domain', ""),
			email: G.ifDefined(this, 'props.site.email', ""),
			content: G.ifDefined(this, 'props.site.content', `# Example website

It's easy to do **bold**, *italic* and [links](http://google.com).

<- For a full guide click on "Markdown Guide" on the left.`)
		}

		const user = Meteor.user();
		if (user && user.getEmail())
			state.email = user.getEmail();

		this.state = state;

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
		let preview = this.state.showPreview;
		const siteId = G.ifDefined(this, 'props.site._id');
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
						<label>Website content <span className="text-normal">(hold alt for preview or <a target="_blank"	href={"/" + (siteId || "")}>see live website</a>)</span></label>
						<Textarea
							className={"w100 padding bbb" + (preview ? ' transparent' : '')}
							name="content"
							value={this.state.content}
							autoFocus={true}
							rows={5}
							onChange={this.handleChange}
						/>
						{preview ?
							<div className="absolute w100 top0"><Marked content={this.state.content}/></div> : null}
					</div>
					{this.state.content.length < 200 ? <div className="field relative"><Introduction/></div> : null}
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