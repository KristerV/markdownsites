import React from 'react';
import '../styles/elements.less';

export default class extends React.Component {

	render() {
		const siteId = FlowRouter.getParam('siteId');
		const linkWriter = `/${siteId}/writer`;
		const linkPreview = `/${siteId}/preview`;
		const linkSettings = `/${siteId}/settings`;
		const linkAbout = `/${siteId}/about`;
		const domain = siteId.indexOf('.') > -1 ? siteId : null;
		return (
			<div>
				{domain ? // If domain set
					<ol className="no-bullets">
						<li>{domain} [switch]</li>
					</ol>
				: null}

				<ol className="no-bullets">
					<li><a href={linkWriter}>Writer</a></li>
					<li><a href={linkPreview}>Preview</a></li>
					<li><a href={linkSettings}>Settings</a></li>
					<li><a href={linkAbout}>About</a></li>
				</ol>

				<ol className="no-bullets">
					<li>Markdown cheatsheet</li>
				</ol>

			</div>
		)
	}

}