import React from 'react';
import Loader from './Loader.jsx';

export default class extends React.Component {

	render() {
		if (!this.props.subReady)
			return <Loader/>;

		const content = React.cloneElement(this.props.content, {site: this.props.site});

		return (<div className="wh100">
			{content}
		</div>)
	}

}