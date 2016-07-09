import React from 'react';
import '/imports/api/users/collection.js';

export default class extends React.Component {

	newSite() {
		const email = Meteor.user().getEmail();
		Meteor.call("sites.upsert", null, {email}, Sites.useResults);
	}

	render() {
		const siteId = FlowRouter.getParam('siteId');
		const linkAbout = `/${siteId}/about`;
		const sites = this.props.sites || [];
		return (
			<div>

				<ol className="no-bullets">
					{sites.map((item, i) => {
						return <a className="block" key={i}
								  href={`/${item.editing.domain}/writer`}>{item.editing.domain}</a>
					})}
					<li><a href="#" onClick={this.newSite}>New site</a></li>
				</ol>

				<ol className="no-bullets">
					<li><a href={linkAbout}>About</a></li>
					<li>Markdown on/off</li>
				</ol>

			</div>
		)
	}

}