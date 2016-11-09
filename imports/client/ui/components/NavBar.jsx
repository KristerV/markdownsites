import React from 'react';

export default class extends React.Component {

	render() {
		const siteId = FlowRouter.getParam('siteId');
		const sites = this.props.sites || [];
		return (
			<div>
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
					<li><a href="/markdown">Markdown Guide</a></li>
					<li><a href="/policy">Policy</a></li>
					<li><a href="/about">About</a></li>
				</ol>

			</div>
		)
	}
}