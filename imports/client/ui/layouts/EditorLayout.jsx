import React from 'react';
import './EditorLayout.less';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/bouncyflip.css';
import '../../startup/tawk';
import NavBarContainer from '../components/NavBarContainer.jsx';
import '../../enable-mobile/index.js';

export default class extends React.Component {

	render() {
		return (<div className="wh100 EditorLayout">
				<nav className>
					<NavBarContainer/>
				</nav>
				<main>
					{this.props.content}
				</main>
				<Alert effect="bouncyflip" position="bottom-right" stack={{limit: 3, spacing: -1}}/>
			</div>
		)
	}

}