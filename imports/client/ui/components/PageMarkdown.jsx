import React from 'react';
import Marked from './Marked';

export default class extends React.Component {

	render() {
		return (<div>
			<h1>Markdown</h1>
			<p>Markdown is a special syntax for easy text-based formatting. No need for complex menus.</p>
			<table className="ui table">
				<thead>
				<tr>
					<th>
						What you write
					</th>
					<th>
						The result
					</th>
				</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<p># Heading 1</p>
							<p>## Heading 2</p>
							<p>### Heading 3</p>
						</td>
						<td>
							<h1>Heading 1</h1>
							<h2>Heading 2</h2>
							<h3>Heading 3</h3>
						</td>
					</tr>
					<tr>
						<td>Hey there, I'm **bold** and *italic* and even ~~strikethrough~~.</td>
						<td>Hey there, I'm <b>bold</b> and <i>italic</i> and even <strike>strikethrough</strike>.</td>
					</tr>
					<tr>
						<td>Here's an [inline link](http://google.com).</td>
						<td>Here's an <a href="http://google.com">inline link</a></td>
					</tr>
					<tr>
						<td>Images are kind of like links:  ![title of image](http://i.imgur.com/BpUoKoF.png)</td>
						<td>Images are kind of like links:<br/><img src="http://i.imgur.com/BpUoKoF.png" alt="title of image"/></td>
					</tr>
					<tr>
						<td>
							<p>- item</p>
							<p>- item</p>
							<p>- item</p>
						</td>
						<td>
							<ul>
								<li>item</li>
								<li>item</li>
								<li>item</li>
							</ul>
						</td>
					</tr>
					<tr>
						<td>
							<p>1. item</p>
							<p>1. item</p>
							<p>1. item</p>
						</td>
						<td>
							<ol>
								<li>item</li>
								<li>item</li>
								<li>item</li>
							</ol>
						</td>
					</tr>
				</tbody>
			</table>
		</div>)
	}

};