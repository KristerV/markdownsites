import namecheap from 'namecheap-api';
import '/imports/api/sites/main.js';

if (Meteor.isServer) {
	namecheap.config.set("ApiUser", G.getEnv('NAMECHEAP_USER'));
	namecheap.config.set("ApiKey", G.getEnv('NAMECHEAP_APIKEY'));
	namecheap.config.set("ClientIp", G.getEnv('NAMECHEAP_CLIENTIP'));
}

DomainServices = {
	updatePrices() {
		Meteor.call('domain.getAllPrices')
	},
	getDNSStatus(siteId) {
		return "you";
	},
	getPaymentStatus(siteId) {
		return "you";
	},
	getAvailability(siteId) {
		const site = Sites.findOne(siteId);
		console.log("site", site.editing.domain);
		const domainName = site.editing.domain.name;
		console.log("domainName", domainName);
		return namecheap.apiCall('namecheap.domains.check', {DomainList: domainName}, G.getEnv('NAMECHEAP_SANDBOXMODE'))
	},
	parseAvailabilityResponse(data) {
		const domainlist = data.response[0].DomainCheckResult;
		if (domainlist && domainlist.length === 1) {
			const d = domainlist[0].$;
			const domain = d.Domain;

			// Keep availability on the safe side
			const domainExtension = G.getDomainExtension(domain);
			const prices = DomainsCollection.find().fetch();
			const price = _.find(prices, obj => {
				return obj.name === domainExtension
			}).mdsPrice;
			const available = d.Available === "true" && d.IsPremiumName === "false" && !!price;

			return {available, price}
		}
	},
	parseError(data) {
		console.log("DomainServices.js:25 parseError()");
		console.log(data);
		if (!data.requestPayload || !G.isDefined(data, 'response.message'))
			throw new Meteor.Error(data.toString());

		const errorcode = parseInt(data.response.message.substring(0, 7));

		let msg = "";
		switch (errorcode) {
			case 2030280:
				msg = "Domain extension not supported. You may still connect manually.";
				break;
			default:
				msg = data.response.toString()
		}
		return {success: false, msg};
	}
};

Meteor.startup(() => {
	if (!Meteor.isDevelopment) {
		Meteor.setTimeout(DomainServices.updatePrices, 1000 * 60 * 1);
	}
	Meteor.setInterval(DomainServices.updatePrices, 1000 * 60 * 60 * 24 * 3); // every 3 days
})
