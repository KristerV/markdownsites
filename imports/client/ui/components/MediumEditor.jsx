import React from 'react';
import ReactDOM from 'react-dom';
import MediumEditor from 'medium-editor';
import MeMarkdown from 'medium-editor-markdown';
import EditorInsert from 'medium-editor-insert-plugin';

// load theme styles with webpack
require('medium-editor/dist/css/medium-editor.css');
require('medium-editor/dist/css/themes/default.css');

// ES module
import Editor from 'react-medium-editor';

export default class extends React.Component {

	change(text) {
		console.log(text);
		this.props.onChange(text);
	}

	render() {
		return(<div></div>)
	}

	componentDidMount() {
		const dom = ReactDOM.findDOMNode(this);
		this.medium = new MediumEditor(dom, this.props.options);
		EditorInsert($);
		$(dom).mediumInsert({
			editor: this.medium
		});
	}
}