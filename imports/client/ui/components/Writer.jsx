import React from 'react';
import {Meteor} from 'meteor/meteor';
import '/imports/G.js';

export default class extends React.Component {

	constructor() {
		super();
		this.updateTimerDelay = 1000;
		this.updateTimer = null;
		this.value = "";

		// http://stackoverflow.com/questions/33457220/onchange-callback-not-firing-in-react-component
		this.onChange = this.onChange.bind(this);
		this.updateContent = this.updateContent.bind(this);
	}

	updateContent() {
		Meteor.call('sites.update', this.props.site._id, {content: this.value});
	}

	onChange(e) {
		this.value = e.target.value;
		Meteor.clearTimeout(this.updateTimer);
		this.updateTimer = Meteor.setTimeout(this.updateContent, this.updateTimerDelay);
	}

	render() {
		let content = this.props.site.content
		return (<textarea className="float-left wh100 padding bbb" onChange={this.onChange} defaultValue={content}/>)
	}

}