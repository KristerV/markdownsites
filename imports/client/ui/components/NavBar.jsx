import React from 'react';
import '../styles/elements.less';

export default class extends React.Component {

	render() {
		return (
			<div>

				<ol className="no-bullets">
					<li>Domain.ee [switch]</li>
				</ol>

				<ol className="no-bullets">
					<li>Preview (hold alt)</li>
					<li>Publish</li>
					<li>Settings</li>
					{/*domain*/}
					{/*website variables*/}
					{/*update website code*/}
					{/*Delete website*/}
					<li>About</li>
				</ol>

				<ol className="no-bullets">
					<li>Markdown</li>
					<li>Layout</li>
					<li>Form elements</li>
					<li>hotkeys</li>
				</ol>

			</div>
		)
	}

}