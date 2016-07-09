import React from 'react';

export default class extends React.Component {

	render() {
		const siteId = FlowRouter.getParam('siteId');
		const linkWriter = `/${siteId}/writer`;
		const linkPreview = `/${siteId}/preview`;
		const linkAbout = `/${siteId}/about`;
		const domain = siteId && siteId.includes('.') ? siteId : null; // Data isn't here so use router params
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
					<li><a href={linkAbout}>About</a></li>
				</ol>

				<ol className="no-bullets">
					<li>Markdown cheatsheet</li>
				</ol>

			</div>
		)
	}

}