import namecheap from 'namecheap-api';

namecheap.config.set("ApiUser", Meteor.settings.NAMECHEAP_USER);
namecheap.config.set("ApiKey", Meteor.settings.NAMECHEAP_APIKEY);
namecheap.config.set("ClientIp", Meteor.settings.NAMECHEAP_CLIENTIP);

Meteor.methods({
	'domain.isAvailable'(siteId, domain) {
		Meteor.call('sites.upsert', siteId, {domainAvailable: "checking"});
		return namecheap.apiCall('namecheap.domains.check', {DomainList: domain}, Meteor.settings.NAMECHEAP_SANDBOXMODE).then(data => {
			
			const domainlist = data.response[0].DomainCheckResult;
			if (domainlist && domainlist.length === 1) {
				const domain = d[0].Domain;
				const available = d[0].Available;
				return {result: 1, domain, available}
			}
			return {result: 0, msg: "not sure what happened"}

		}).catch(data => {

			const domain = data.requestPayload.DomainList;
			const errorcode = parseInt(data.response.message.substring(0, 7));

			let msg = "";
			switch (errorcode) {
				case 2030280:
					msg = "Domain extension not supported. You may still connect manually.";
					break;
				default:
					msg = data.response.toString()
			}
			return {result: 0, msg}
		});
	},
	'domain.updateAvailability'(siteId, domain, message) {
		console.log("UP AVAIL");
		const site = SitesCollection.findOne({$or: [{_id: siteId}, {domain: siteId}]});
		if (site.editing.domain === domain) {
			Meteor.call('sites.upsert', siteId, {siteAvailability: message});
		}
		console.log("UP AVAIL END");
	}
});