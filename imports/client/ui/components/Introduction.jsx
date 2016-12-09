import React from 'react';
import Marked from './Marked';

export default class extends React.Component {

	render() {
		return (<Marked content={`
### [See example result.](http://www.krister.ee)
`
		}/>)
	}

};
