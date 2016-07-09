import React from 'react';
import './EditorLayout.less';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/bouncyflip.css';

import NavBar from '../components/NavBar.jsx';

export default class extends React.Component {

	render() {
		return (<div className="wh100 EditorLayout">
				<nav>
					<NavBar/>
					<NavBar/>
				</nav>
				<main>
					{this.props.content}
				</main>
				<Alert effect="bouncyflip" position="bottom-right" stack={{limit: 3, spacing: -1}}/>
			</div>
		)
	}

}