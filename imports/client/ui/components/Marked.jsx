import React from 'react';
import Remarkable from 'remarkable';

export default class extends React.Component {

	render() {
		var md = new Remarkable({
			breaks: true
		});
		const source = this.props.source || 'published';
		const markdown = G.ifDefined(this, `props.site.${source}.content`);
		return (
			<div
				className="padding bbb w100 bg-white"
				dangerouslySetInnerHTML={{__html: md.render(markdown)}}
			></div>
		)
	}
}