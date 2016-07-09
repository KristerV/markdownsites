import React from 'react';
import './PublishedLayout.less';

export default class extends React.Component {

	render() {
		return (<div className="PublishedLayout">
				<main>
					{this.props.content}
				</main>
			</div>
		)
	}

}