import React from 'react';
import Marked from './Marked';

export default class extends React.Component {

	render() {
		return (<Marked content={`
To publish your site you have three options.

- Use the free service and keep your site at http://markdownsites.com/your-site-has
- Buy a domain through this website and let us do the setting up part
- Buy a domain elsewhere and connect it to your markdown site manually.

## Connecting a domain you own elsewhere

123...
`
		}/>)
	}

};