import React from 'react';
import ReactDOM from 'react-dom';
import MediumEditor from 'medium-editor';
import MarkdownIt from 'markdown-it';
import Editor from 'react-medium-editor';
import upndown from 'upndown';
require('medium-editor/dist/css/medium-editor.css');
require('medium-editor/dist/css/themes/default.css');

export default class extends React.Component {

	constructor(props) {
		super(props);

		// Markdown->HTML converter
		this.markit = new MarkdownIt({
			linkify: true,
			breaks: true,
		});

		// HTML->Markdown converter
		this.und = new upndown();
	}

	render() {

		// Basically a placeholder with default text
		const text = this.markit.render(this.props.markdown);
		return(<div dangerouslySetInnerHTML={{__html: text}}></div>)
	}

	componentDidMount() {

		// Editor options
		let options = this.props.options || {};
		options.imageDragging = false;
		options.targetBlank = true;
		options.toolbar = {
			buttons: ['bold', 'italic', 'h1', 'h2', 'h3', 'anchor', 'image', 'orderedlist', 'unorderedlist', 'quote']
		};
		options.extensions = {
			imageDragging: {},
		};

		// Create the editor
		const dom = ReactDOM.findDOMNode(this);
		this.medium = new MediumEditor(dom, options);

		// Respond to updates
		this.medium.subscribe('editableInput', (event, editable) => {
		    this.und.convert(editable.innerHTML, (err, res) => {
		    	if (err)
		    		console.error(err);
		    	if (res)
		    		this.props.onChange(res);
		    });
		});
	}
}