import namecheap from 'namecheap-api';
import '../sites/Sites.js';

namecheap.config.set("ApiUser", G.getEnv('NAMECHEAP_USER'));
namecheap.config.set("ApiKey", G.getEnv('NAMECHEAP_APIKEY'));
namecheap.config.set("ClientIp", G.getEnv('NAMECHEAP_CLIENTIP'));

Meteor.methods({
	'domain.isAvailable'(siteId, domain) {
		check(siteId, String);
		console.log("siteId", siteId);
		console.log("UPDATE");
		Sites.setDomainChecking(siteId);
		console.log(SitesCollection.findOne(siteId).editing.domain);

		const prices = DomainsCollection.find().fetch(); // bit of a hack I guess, but can't figure out fibers for this case
		return namecheap.apiCall('namecheap.domains.check', {DomainList: domain}, G.getEnv('NAMECHEAP_SANDBOXMODE'))
			.then(Meteor.bindEnvironment(data => {
				const domainlist = data.response[0].DomainCheckResult;
				if (domainlist && domainlist.length === 1) {
					const d = domainlist[0].$;
					const domain = d.Domain;

					// Keep availability on the safe side
					const domainExtension = G.getDomainExtension(domain);
					const price = _.find(prices, obj => {
						return obj.name === domainExtension
					}).mdsPrice;
					const available = d.Available === "true" && d.IsPremiumName === "false" && price;

					Sites.setDomainAvailability(siteId, available, price);
				}
				Sites.setDomainError(siteId, 'Something went wrong: 6254');

			})).catch(Meteor.bindEnvironment(data => {
				if (!data.requestPayload)
					throw new Meteor.Error(data.toString());

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

				Sites.setDomainError(siteId, msg);
			}));
	},
	'domain.getAllPrices'() {
		console.info("domain.getAllPrices: Fetch data");
		namecheap.apiCall('namecheap.users.getPricing', {
			ProductType: "DOMAIN",
			ProductCategory: "REGISTER"
		}, G.getEnv('NAMECHEAP_SANDBOXMODE'))
			.then(Meteor.bindEnvironment((data) => {
				console.info("domain.getAllPrices: crunching..");
				const services = data.response[0].UserGetPricingResult[0].ProductType[0].ProductCategory;
				let restructure = {};
				for (service of services) {
					const serviceType = service.$.Name;
					for (product of service.Product) {
						const extension = product.$.Name;
						if (!restructure[extension]) restructure[extension] = {}
						const priceObj = product.Price[0].$;
						const price = priceObj.Currency === "USD" ? parseFloat(priceObj.Price) : null;
						restructure[extension][serviceType] = price;
						restructure[extension].name = extension;
					}
				}

				console.info("domain.getAllPrices: upserting..");

				for (const key in restructure) {
					let r = restructure[key];
					r.mdsPrice = Math.round(Math.max(r.register, r.renew || 0));
					if (r.mdsPrice) r.mdsPrice += 5;
					DomainsCollection.upsert({name: key}, r);
				}

				console.info("domain.getAllPrices: Done");

			})).catch(data => {
			console.error(data)
		});
	},
	'domain.isConnected'(siteId) {
		check(siteId, String);
		const site = SitesCollection.findOne(siteId);
		const domain = site.editing.domain.name;
		return;
		return namecheap.apiCall('namecheap.domains.check', {DomainList: domain}, G.getEnv('NAMECHEAP_SANDBOXMODE'))
			.then(data => {
				const domainlist = data.response[0].DomainCheckResult;
				if (domainlist && domainlist.length === 1) {
					const d = domainlist[0].$;
					const domain = d.Domain;

					// Keep availability on the safe side
					const domainExtension = G.getDomainExtension(domain);
					const price = _.find(prices, obj => {
						return obj.name === domainExtension
					}).mdsPrice;
					const available = d.Available === "true" && d.IsPremiumName === "false" && price;

					return {result: 1, domain, available, price};
				}
				return {result: 0, msg: "not sure what happened"}

			}).catch(data => {
				if (!data.requestPayload)
					throw new Meteor.Error(data.toString());

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
	}
});