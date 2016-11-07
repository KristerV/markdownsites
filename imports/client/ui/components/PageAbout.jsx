import React from 'react';
import Marked from './Marked';

export default class extends React.Component {

	render() {
		return (<Marked content={`
- Your text based website up in 5 minutes
- As easy as markdown
- Extremely low annual cost
`
		}/>)
	}

};