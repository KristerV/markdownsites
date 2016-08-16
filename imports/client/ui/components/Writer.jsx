import React from 'react';
import {Meteor} from 'meteor/meteor';
import '/imports/G.js';
import Marked from './Marked.jsx';
import DomainInput from './DomainInput.jsx';
import Textarea from 'react-autosize-textarea';

export default class extends React.Component {

	constructor(props) {
		super(props);
		this.updateTimerDelay = 3000;
		this.updateTimer = null;
		this.markdown = G.ifDefined(this, 'props.site.editing.content', "");

		this.state = {
			showPreview: false
		}

		this.onChange = this.onChange.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
		this.update = this.update.bind(this);
		this.publish = this.publish.bind(this);
	}

	update(e, callback) {
		let id = G.isDefined(this, "props.site") ? this.props.site._id : null;

		let data = {};
		if (G.isDefined(e, 'target.name') && e.target.name !== 'content')
			data = {[e.target.name]: e.target.value};
		else
			data = {'content': this.markdown};

		// Previewing empty content
		const values = _.values(data);
		if (values.length === 1 && values[0] === null)
			return false;

		callback = callback || Sites.useResults;
		Meteor.call("sites.upsert", id, data, callback);
	}

	onChange(e) {
		this.markdown = e.target.value;
		Meteor.clearTimeout(this.updateTimer);
		this.updateTimer = Meteor.setTimeout(this.update.bind(this), this.updateTimerDelay);
	}

	publish() {
		this.update(null, () => {
			Meteor.call('sites.publish', this.props.site._id, Sites.useResults);
		})
	}

	render() {
		let preview = this.state.showPreview;
		return (<div className="writer relative">
				<div className="ui form">
					<div className="fields">
						<DomainInput site={G.ifDefined(this, 'props.site', null)} domain={G.ifDefined(this, 'props.site.editing.domain.name', "")}/>
						<div className="field">
							<label>Owners email</label>
							<input type="email" defaultValue={G.ifDefined(this, 'props.site.editing.email', "")} name="email" onBlur={this.update}/>
						</div>
						<div className="field">
							<label>&nbsp;</label>
							<button className="ui button primary" onClick={this.publish}>Publish</button>
						</div>
					</div>
					<div className="field relative">
						<label>Markdown <span className="see-through text-normal">(hold alt for preview)</span></label>
						<Textarea
							className={"w100 padding bbb" + (preview ? ' transparent' : '')}
							name="content"
							onChange={this.onChange}
							defaultValue={this.markdown}
							autoFocus={true}
							rows={5}
						/>
						{preview ? <div className="absolute w100 top0"><Marked {...this.props}/></div> : null}
					</div>
				</div>
			</div>
		)
	}

	componentDidMount() {
		_this = this;
		// Alt preview
		$('.writer').keydown((e) => {
			if (e.which === 18) {
				_this.setState({showPreview: true});
				_this.update();
			}
		});
		$('.writer').keyup((e) => {
			if (e.which === 18) {
				_this.setState({showPreview: false});
			}
		});
	}

}