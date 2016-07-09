import React from 'react';
import Loader from './Loader.jsx';

export default class extends React.Component {

	render() {
		if (!this.props.subReady)
			return <Loader/>;

		let content = this.props.content;
		let props = {
			site: this.props.site,
			source: this.props.source || 'published'
		}
		content = React.cloneElement(content, props);

		return (<div className="wh100">
			{content}
		</div>)
	}

}