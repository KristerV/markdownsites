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
				{Meteor.user() && Meteor.user().getEmail() ?
					<ol className="no-bullets">
						{sites.map((item, i) => {
							const domain = G.ifDefined(item, 'editing.domain.name');
							return <a className="block" key={i}
									  href={`/${domain || item._id}/writer`}>{domain || 'new'}</a>
						})}
						<li><a href="#" onClick={this.newSite}>New site</a></li>
					</ol>
				: null}
				<ol className="no-bullets">
					<li><a href={linkAbout}>About</a></li>
					<li>Markdown on/off</li>
				</ol>

			</div>
		)
	}

}