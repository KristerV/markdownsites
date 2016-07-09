import React from 'react';
import {Meteor} from 'meteor/meteor';
import '/imports/G.js';
import Marked from './Marked.jsx';
import Textarea from 'react-autosize-textarea';

export default class extends React.Component {

	constructor() {
		super();
		this.updateTimerDelay = 3000;
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
		let id = this.props.site ? this.props.site._id : null;
		Meteor.call("sites.upsert", id, {content: this.value}, Sites.useResults);
	}

	onChange(e) {
		this.value = e.target.value;
		Meteor.clearTimeout(this.updateTimer);
		this.updateTimer = Meteor.setTimeout(this.updateContent, this.updateTimerDelay);
	}

	render() {
		let content = this.props.site.content;
		let preview = this.state.showPreview;
		return (<div className="writer relative">
				{preview ? <div className="absolute bg-white"><Marked {...this.props}/></div> : null}
				<Textarea
					className={"w100 padding bbb" + (preview ? ' transparent' : '')}
					onChange={this.onChange}
					defaultValue={content}
					autoFocus={true}
				/>
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
	}

}