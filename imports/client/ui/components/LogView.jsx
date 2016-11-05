import React from 'react';

export default class extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			logsCache: null
		};
		this.toggleReactivity = this.toggleReactivity.bind(this);
	}

	toggleReactivity() {
		if (this.state.logsCache)
			this.setState({logsCache: null});
		else
			this.setState({logsCache: this.props.logs})
	}

	render() {
		const cacheEnabled = !!this.state.logsCache;
		let logs;
		if (cacheEnabled)
			logs = this.state.logsCache;
		else
			logs = this.props.logs;
		return (
			<div>
				<button className="log-togglebutton" onClick={this.toggleReactivity}>{cacheEnabled ? "stopped" : "tailing"}</button>
				<table className="logTable">
					<tbody>
					{logs.map((item, index, all) => {
						var tableClass = "";
						if (item.level === 'error')
							tableClass = "log-error";
						else if (item.level === 'warn')
							tableClass = "log-warning";
						else if (item.level === 'debug')
							tableClass = "log-debug";
						else if (item.message === "app restarted")
							tableClass = "log-apprestarted";

						const meta = JSON.stringify(item.meta, null, 4).substring(0, 30000);
						return <tr key={index} className={tableClass}>
							<td style={{width: "150px"}}>{item.timestamp.toLocaleString()}</td>
							<td style={{width: "50px"}}>{item.level}</td>
							<td style={{width: "350px"}}>{item.message}</td>
							<td>{meta}</td>
						</tr>;
					})}
					</tbody>
				</table>
			</div>
		)
	}

};