import namecheap from 'namecheap-api';
import '/imports/api/sites/main.js';

if (Meteor.isServer) {
	namecheap.config.set("ApiUser", G.getEnv('NAMECHEAP_USER'));
	namecheap.config.set("ApiKey", G.getEnv('NAMECHEAP_APIKEY'));
	namecheap.config.set("ClientIp", G.getEnv('NAMECHEAP_CLIENTIP'));
}

DomainServices = {
	getDNSStatus(domainName) {
		return; // Turns out namecheap doesn't have an API for this
		const parts = domainName.split('.');
		return namecheap.apiCall('namecheap.domains.dns.getList', {SLD: parts[0], TLD: parts[1]}, G.getEnv('NAMECHEAP_SANDBOXMODE'));
	},
	getAvailability(domainName) {
		return namecheap.apiCall('namecheap.domains.check', {DomainList: domainName}, G.getEnv('NAMECHEAP_SANDBOXMODE'));
	},
	parseAvailabilityResponse(data) {
		const domainlist = data.response[0].DomainCheckResult;
		if (domainlist && domainlist.length === 1) {
			const d = domainlist[0].$;
			const domain = d.Domain;

			let available = false;
			let price = 0;
			const domainExtension = G.getDomainExtension(domain);
			const domainData = DomainsCollection.findOne({name: domainExtension});
			if (domainData) {
				price = domainData.mdsPrice;
				available = d.Available === "true" && d.IsPremiumName === "false" && !!price;
			}

			return {available, price};
		}
	},
	parseError(data) {
		if (!data.requestPayload || !G.isDefined(data, 'response.message'))
			throw new Meteor.Error(data.toString());

		const errorcode = parseInt(data.response.message.substring(0, 7));

		let msg = "";
		switch (errorcode) {
			case 2030280:
				msg = "Domain extension not supported. You may still connect manually.";
				break;
			case 1011150:
				msg = "Server error: IP not configured."
				break;
			default:
				msg = data.response.toString()
		}
		return {success: false, msg};
	},
	updateDomainPrices() {
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
	buyDomain(siteId) {
		const site = Sites.findOne(siteId);
		const domain = site.editing.domain.name;
		return namecheap.apiCall('namecheap.domains.create', {
			DomainName: domain,
			Years: 1,
			RegistrantFirstName: 'Krister',
			RegistrantLastName: 'Viirsaar',
			RegistrantAddress1: 'Vilmsi 29-4',
			RegistrantCity: 'Tallinn',
			RegistrantStateProvince: 'Harjumaa',
			RegistrantPostalCode: '10126',
			RegistrantCountry: 'Estonia',
			RegistrantPhone: '+372.56355555',
			RegistrantEmailAddress: 'krister.viirsaar@gmail.com',
			TechFirstName: 'Krister',
			TechLastName: 'Viirsaar',
			TechAddress1: 'Vilmsi 29-4',
			TechCity: 'Tallinn',
			TechStateProvince: 'Harjumaa',
			TechPostalCode: '10126',
			TechCountry: 'Estonia',
			TechPhone: '+372.56355555',
			TechEmailAddress: 'krister.viirsaar@gmail.com',
			AdminFirstName: 'Krister',
			AdminLastName: 'Viirsaar',
			AdminAddress1: 'Vilmsi 29-4',
			AdminCity: 'Tallinn',
			AdminStateProvince: 'Harjumaa',
			AdminPostalCode: '10126',
			AdminCountry: 'Estonia',
			AdminPhone: '+372.56355555',
			AdminEmailAddress: 'krister.viirsaar@gmail.com',
			AuxBillingFirstName: 'Krister',
			AuxBillingLastName: 'Viirsaar',
			AuxBillingAddress1: 'Vilmsi 29-4',
			AuxBillingCity: 'Tallinn',
			AuxBillingStateProvince: 'Harjumaa',
			AuxBillingPostalCode: '10126',
			AuxBillingCountry: 'Estonia',
			AuxBillingPhone: '+372.56355555',
			AuxBillingEmailAddress: 'krister.viirsaar@gmail.com'
		}, G.getEnv('NAMECHEAP_SANDBOXMODE'))
	}
};

Meteor.startup(() => {
	const dotCom = DomainsCollection.findOne({name: 'com'})
	if (!dotCom) {
		DomainServices.updateDomainPrices();
	}
	Meteor.setInterval(DomainServices.updateDomainPrices, 1000 * 60 * 60 * 24 * 3); // every 3 days
})
