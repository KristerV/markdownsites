import React from 'react';

export default class extends React.Component {

	render() {
		return (
			<div>
				<p>
					This site is still under construction.<br/>You can contact krister.viirsaar@gmail.com with questions.
				</p>
				<h3>Company details</h3>
				<p>Täp OÜ, 12125250<br/>Vilmsi 29-4, Tallinn 10126, Estonia</p>
				<h3>Terms and Conditions</h3>
				<ol>
					<li>Any domain bought through this site will ultimately belong to the end client. Upon request and payment of transfer fees the domain will be transfered to the end-user.</li>
					<li>Any illegal content will be removed upon notification of such content.</li>
					<li>Prices may change at any time, but active subscriptions will remain as they are, unless the domain service-providers change their prices. In the latter case anyone affected will be notified 30-days in advance.</li>
					<li>Any content the user publishes through this site will be publicliy available for all to see. Well, such is the point of this website in the first place.</li>
				</ol>
				<h3>Pricing</h3>
				<p>Hosting a site here and connecting it to a pre-owned domain is free. Buying a domain and setting the DNS up is not. Here's a list of the most popular domains and their prices.</p>
				<ul>
					<li>.com - $16 a year</li>
					<li>.co.uk - $13 a year</li>
					<li>.org - $17 a year</li>
					<li>.net - $17 a year</li>
					<li>.info - $15 a year</li>
					<li>.io - $64 a year</li>
				</ul>
			</div>
		)
	}

}
