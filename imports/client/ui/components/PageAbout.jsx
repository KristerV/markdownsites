import React from 'react';
import Marked from './Marked';

export default class extends React.Component {

	render() {
		return (<Marked content={`
I made this site out of personal need for a quick way to deploy markdown based websites and connect them with domains. Managing them in one place is a massive plus. I put in the extra effort to make it usable for everyone, hopefully you can find it useful.

You can contact me though the support chat or email: krister.viirsaar@gmail.com.

Krister
`
		}/>)
	}

};