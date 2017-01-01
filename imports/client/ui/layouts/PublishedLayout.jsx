import React from 'react';
import './PublishedLayout.less';
import '../../enable-mobile/index.js';

export default class extends React.Component {

	render() {
		return (<div className="PublishedLayout">
				{this.props.content}
			</div>
		)
	}

}