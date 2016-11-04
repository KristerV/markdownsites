import React from 'react';
import Remarkable from 'remarkable';

export default class extends React.Component {

	render() {
		var md = new Remarkable({
			breaks: true
		});
		const content = G.ifDefined(this, 'props.content');
		return (
			<div
				className="padding bbb w100 bg-white"
				dangerouslySetInnerHTML={{__html: md.render(content)}}
			></div>
		)
	}
}