import React from 'react';
import Marked from './Marked';

export default class extends React.Component {

	render() {
		return (<Marked content={`
# Connecting a custom domain

If you already own a domain here's how to connect it here:

1. Enter your domain to the "Domain name" input (on the front page) and save site.
1. CNAME the www domain to markdownsites.scalingo.io
1. Send the domain to krister.viirsaar@gmail.com, I need to route them to the site manually.
`
		}/>)
	}

};