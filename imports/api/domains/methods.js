import namecheap from 'namecheap-api';

namecheap.config.set("ApiUser", G.getEnv('NAMECHEAP_USER'));
namecheap.config.set("ApiKey", G.getEnv('NAMECHEAP_APIKEY'));
namecheap.config.set("ClientIp", G.getEnv('NAMECHEAP_CLIENTIP'));

Meteor.methods({
	'domain.isAvailable'(domain) {
		console.log("isAvailable 1");
		const prices = DomainsCollection.find().fetch(); // bit of a hack I guess, but can't figure out fibers for this case
		console.log("isAvailable 2");
		return namecheap.apiCall('namecheap.domains.check', {DomainList: domain}, G.getEnv('NAMECHEAP_SANDBOXMODE'))
			.then(data => {
				console.log("isAvailable 3");
				const domainlist = data.response[0].DomainCheckResult;
				console.log("isAvailable 4");
				if (domainlist && domainlist.length === 1) {
					console.log("isAvailable 5");
					const d = domainlist[0].$;
					const domain = d.Domain;

					// Keep availability on the safe side
					console.log("isAvailable 6");
					const domainParts = domain.split('.');
					const domainExtension = domainParts[domainParts.length - 1];
					console.log("isAvailable 7");
					const price = _.find(prices, obj => {return obj.name === domainExtension}).mdsPrice;
					console.log("isAvailable 8");
					const available = d.Available === "true" && d.IsPremiumName === "false" && price;

					console.log("isAvailable 9");
					return {result: 1, domain, available, price};
				}
				console.log("isAvailable 10");
				return {result: 0, msg: "not sure what happened"}
				console.log("isAvailable 11");

			}).catch(data => {
				console.log("isAvailable 12");
				if (!data.requestPayload)
					throw new Meteor.Error(data.toString());
				console.log("isAvailable 13");

				const domain = data.requestPayload.DomainList;
				console.log("isAvailable 14");
				const errorcode = parseInt(data.response.message.substring(0, 7));
				console.log("isAvailable 15");

				let msg = "";
				console.log("isAvailable 16");
				switch (errorcode) {
					case 2030280:
						msg = "Domain extension not supported. You may still connect manually.";
						break;
					default:
						msg = data.response.toString()
				}
				console.log("isAvailable 17");
				return {result: 0, domain, msg}
			});
	},
	'domain.getAllPrices'() {
		console.info("domain.getAllPrices: Fetch data");
		return namecheap.apiCall('namecheap.users.getPricing', {ProductType: "DOMAIN", ProductCategory: "REGISTER"}, G.getEnv('NAMECHEAP_SANDBOXMODE'))
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
	}
});