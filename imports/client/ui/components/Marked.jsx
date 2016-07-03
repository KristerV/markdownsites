import React from 'react';
import Remarkable from 'remarkable';

export default class extends React.Component {

	parseMarkdown() {
	}

	render() {
		var md = new Remarkable({
			breaks: true
		});
		return (
			<div dangerouslySetInnerHTML={{__html: md.render(this.props.site.content)}}></div>
		)
	}

}