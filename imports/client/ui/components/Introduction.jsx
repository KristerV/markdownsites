import React from 'react';
import Marked from './Marked';

export default class extends React.Component {

	render() {
		return (<Marked content={`
# Publish your website in 5 minutes

- Write your content in markdown
- Buy a domain (automatic setup)
- Login with email (no passwords here)
`
		}/>)
	}

};
