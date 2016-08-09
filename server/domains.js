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
				const domain = domainlist[0].$.Domain;
				const available = domainlist[0].$.Available === "true";
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
			return {result: 0, domain, msg}
		});
	},
});