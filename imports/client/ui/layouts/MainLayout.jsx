import React from 'react';

import '../styles/dev.less';
import '../styles/layout.less';
import './MainLayout.less';

import NavBar from '../components/NavBar.jsx';

export default class extends React.Component {

	render() {
		return (<div className="wh100 MainLayout">
				<nav className="dev-bg h100 float-left">
					<NavBar/>
				</nav>
				<main className="dev-bg h100 float-left">
					{this.props.content}
				</main>
			</div>
		)
	}

}