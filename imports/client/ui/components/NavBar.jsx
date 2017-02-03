import React from 'react';

export default class extends React.Component {

	render() {
		const siteId = FlowRouter.getParam('siteId');
		const sites = this.props.sites || [];
		const guest = G.ifDefined(Meteor.user(), 'profile.guest');
		return (
			<div className="relative h100">
				<ol className="no-bullets">
					<li className="nav-title">My sites</li>
					{sites.map((item, i) => {
						return <a className="block" key={i}
								  href={`/${item._id}/writer`}>{item.domain || 'Unnamed site'}</a>
					})}
					<li><a href="/"> + new</a></li>
				</ol>
				<ol className="no-bullets">
					<li className="nav-title">Info</li>
					{/*<li><a href="/markdown">Markdown Guide</a></li>*/}
					<li><a href="/policy">Policy</a></li>
					<li><a href="/custom-domain">Connect custom domain</a></li>
					<li><a href="/about">About</a></li>
				</ol>
				{guest ?
					<ol className="no-bullets">
						<a href="/login" className="ui blue basic button" style={{bottom: "14px"}}>Login</a>
					</ol>
					:
					null
				}

			</div>
		)
	}
}