import React from 'react';

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
					<li className="nav-title">My sites</li>
					{sites.map((item, i) => {
						return <a className="block" key={i}
								  href={`/${item._id}/writer`}>{item.domain || 'Unnamed site'}</a>
					})}
					<li><a href="#" onClick={this.newSite}> + new</a></li>
				</ol>
				<ol className="no-bullets">
					<li className="nav-title">Info</li>
					<li><a href={linkAbout}>About</a></li>
				</ol>

			</div>
		)
	}

}