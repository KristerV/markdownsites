import React from 'react';
import Marked from './Marked';

export default class extends React.Component {

	render() {
		return (<Marked content={`
# Terms and Conditions

- Any domain bought through this site will ultimately belong to the end client. Upon request and payment of transfer fees the domain will be transfered to the end-user.
- Any illegal content will be removed upon notification of such content.
- Prices may change at any time, but active subscriptions will remain as they are, unless the domain service-providers change their prices. In the latter case anyone affected will be notified 30-days in advance.
- Any content the user publishes through this site will be publicliy available for all to see. Well, such is the point of this website in the first place.

# Pricing

Hosting a site here and connecting it to a pre-owned domain is free. Buying a domain and setting the DNS up is not. Here's a list of the most popular domains and their prices.

- .com - $16 a year
- .co.uk - $13 a year
- .org - $17 a year
- .net - $17 a year
- .info - $15 a year
- .io - $64 a year

# Company details

Täp OÜ, 12125250
Vilmsi 29-4, Tallinn 10126, Estonia
`
		}/>)
	}

};