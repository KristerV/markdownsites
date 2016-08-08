import namecheap from 'namecheap-api';

namecheap.config.set("ApiUser", Meteor.settings.NAMECHEAP_USER);
namecheap.config.set("ApiKey", Meteor.settings.NAMECHEAP_APIKEY);
namecheap.config.set("ClientIp", Meteor.settings.NAMECHEAP_CLIENTIP);

Meteor.methods({
	'domain.isAvailable'(siteId, domain) {
		Meteor.call('sites.upsert', siteId, {domainAvailable: "checking"});
		namecheap.apiCall('namecheap.domains.check', {DomainList: domain}, Meteor.settings.NAMECHEAP_SANDBOXMODE).then(data => {
			console.log("Done");
			const domainlist = data.response[0].DomainCheckResult;
			if (domainlist && domainlist.length === 1) {
				const domain = d[0].Domain;
				const available = d[0].Available ? 'available' : 'taken';
				console.log("CALL 1");
				Meteor.call('domain.updateAvailability', siteId, domain, available);

			}
		}).catch(data => {
			console.log("catch");
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
			console.log("CALL 2");
			Meteor.call('domain.updateAvailability', siteId, domain, msg);
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