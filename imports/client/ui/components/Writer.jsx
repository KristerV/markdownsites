import React from 'react';
import {Meteor} from 'meteor/meteor';
import '/imports/G.js';
import Marked from './Marked.jsx';

export default class extends React.Component {

	constructor() {
		super();
		this.updateTimerDelay = 1000;
		this.updateTimer = null;
		this.value = "";

		this.state = {
			showPreview: false
		}

		// http://stackoverflow.com/questions/33457220/onchange-callback-not-firing-in-react-component
		this.onChange = this.onChange.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
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
		return (<div className="wh100 writer relative">
				{this.state.showPreview ? <div className="wh100 absolute bg-white"><Marked {...this.props}/></div> : null}
				<textarea className="float-left wh100 padding bbb" onChange={this.onChange} defaultValue={content}/>)
			</div>
		)
	}

	componentDidMount() {
		// Alt preview
		$('.writer').keydown((e) => {
			if (e.which === 18) {
				this.setState({showPreview: true})
			}
		});
		$('.writer').keyup((e) => {
			if (e.which === 18) {
				this.setState({showPreview: false})
			}
		});
		$('.writer textarea').focus()
	}

}