import React from 'react';
import Loader from './Loader.jsx';

export default class extends React.Component {

	render() {
		if (!this.props.subReady)
			return <Loader/>;

		let content = this.props.content;
		const site = this.props.site;
		content = React.cloneElement(content, {site: site});

		return (<div className="wh100">
			{content}
		</div>)
	}

}