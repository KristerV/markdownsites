import React from 'react';

export default class extends React.Component {

	render() {
		return (<table className="logTable">
			<tbody>
			{this.props.logs.map((item, index, all) => {
				var tableClass = "";
				if (item.level === 'error')
					tableClass = "log-error";
				else if (item.level === 'warning')
					tableClass = "log-warning";
				else if (item.level === 'debug')
					tableClass = "log-debug";
				else if (item.message === "APPRESTARTED")
					tableClass = "log-apprestarted";

				return <tr key={index} className={tableClass}>
					<td style={{width: "150px"}}>{item.timestamp.toLocaleString()}</td>
					<td style={{width: "50px"}}>{item.level}</td>
					<td style={{width: "300px"}}>{item.message}</td>
					<td>{JSON.stringify(item.meta, null, 4)}</td>
				</tr>;
			})}
			</tbody>
		</table>)
	}

}