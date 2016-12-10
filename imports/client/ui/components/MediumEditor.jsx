import React from 'react';
import ReactDOM from 'react-dom';
import MediumEditor from 'medium-editor';
import MeMarkdown from 'medium-editor-markdown';
import MarkdownIt from 'markdown-it';
import Editor from 'react-medium-editor';
require('medium-editor/dist/css/medium-editor.css');
require('medium-editor/dist/css/themes/default.css');

export default class extends React.Component {

	constructor(props) {
		super(props);
		this.markit = new MarkdownIt({
			linkify: true,
			breaks: true,
		});
	}

	render() {
		const text = this.markit.render(this.props.markdown);
		return(<div dangerouslySetInnerHTML={{__html: text}}></div>)
	}

	componentDidMount() {
		const dom = ReactDOM.findDOMNode(this);

		let options = this.props.options || {};
		options.imageDragging = false;
		options.targetBlank = true;
		options.toolbar = {
			buttons: ['bold', 'italic', 'h1', 'h2', 'h3', 'anchor', 'image', 'orderedlist', 'unorderedlist', 'quote']
		};

		options.extensions = {
			markdown: new MeMarkdown(md => {
				this.props.onChange(md);
			}),
			imageDragging: {},
		};
		this.medium = new MediumEditor(dom, options);
	}
}