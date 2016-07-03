import React from 'react';
import '../styles/elements.less';

export default class extends React.Component {

	publish() {
		console.log("PUBLISH");
	}

	render() {
		const siteId = FlowRouter.getParam('siteId');
		const linkWriter = `/${siteId}/writer`;
		const linkPreview = `/${siteId}/preview`;
		const linkSettings = `/${siteId}/settings`;
		const linkAbout = `/${siteId}/about`;
		return (
			<div>

				<ol className="no-bullets">
					<li>Domain.ee [switch]</li>
				</ol>

				<ol className="no-bullets">
					<li><a href={linkWriter}>Writer</a></li>
					<li><a href={linkPreview}>Preview</a></li>
					<li><a href="#" onClick={this.publish.bind(this)}>Publish</a></li>
					<li><a href={linkSettings}>Settings</a></li>
					<li><a href={linkAbout}>About</a></li>
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