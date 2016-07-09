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

				<ol className="no-bullets">
					<li><a href={linkAbout}>Site1</a></li>
					<li><a href={linkAbout}>Site2</a></li>
					<li><a href={linkAbout}>New site</a></li>
				</ol>

				<ol className="no-bullets">
					<li><a href={linkAbout}>About</a></li>
					<li>Markdown on/off</li>
				</ol>

			</div>
		)
	}

}