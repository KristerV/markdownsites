import namecheap from 'namecheap-api';
import ScalingoServices from './ScalingoServices';

log.debug("NAMECHEAP init");
namecheap.config.set("ApiUser", G.getEnv('NAMECHEAP_USER'));
namecheap.config.set("ApiKey", G.getEnv('NAMECHEAP_APIKEY'));
namecheap.config.set("ClientIp", G.getEnv('NAMECHEAP_CLIENTIP'));

export default {
	getAvailability(domainName) {
		log.info('NAMECHEAP get domain availability', {domainName});
		return namecheap.apiCall('namecheap.domains.check', {DomainList: domainName}, G.getEnv('NAMECHEAP_SANDBOXMODE'));
	},
	parseAvailabilityResponse(data) {
		log.debug('NAMECHEAP parseAvailabilityResponse');
		const domainlist = data.response[0].DomainCheckResult;
		if (domainlist && domainlist.length === 1) {
			const d = domainlist[0].$;
			const domain = d.Domain;

			let available = false;
			let price = 0;
			const domainExtension = G.getDomainExtension(domain);
			const domainData = ExtensionsAvailableCollection.findOne({name: domainExtension});
			if (domainData) {
				price = domainData.mdsPrice;
				available = d.Available === "true" && d.IsPremiumName === "false" && !!price;
			}
			log.info('NAMECHEAP parseAvailabilityResponse DONE', [domain, available]);

			return {available, price, domain};
		}
	},
	parseError(data) {
		log.info('NAMECHEAP parseError', data);
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
		log.info('NAMECHEAP get domain prices');
		namecheap.apiCall('namecheap.users.getPricing', {
			ProductType: "DOMAIN",
			ProductCategory: "REGISTER"
		}, G.getEnv('NAMECHEAP_SANDBOXMODE'))
			.then(Meteor.bindEnvironment((data) => {
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

				log.info('NAMECHEAP get domain prices DONE', {"Number of extensions fetched": Object.keys(restructure).length});
				for (const key in restructure) {
					let r = restructure[key];
					r.mdsPrice = Math.round(Math.max(r.register, r.renew || 0));
					if (r.mdsPrice) r.mdsPrice += 5;
					ExtensionsAvailableCollection.upsert({extension: key}, r);
				}

			})).catch(data => log.error("NAMECHEAP get domain prices", data));
	},
	buyDomain(domain, siteId) {
		log.info('NAMECHEAP buy domain', {domain, siteId});
		if (!domain || !siteId) {
			log.warn('NAMECHEAP buy domain MISSING DATA', {domain, siteId});
			return;
		}
		namecheap.apiCall('namecheap.domains.create', {
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
			.then(Meteor.bindEnvironment(data => {
				let response = data.response[0].DomainCreateResult[0].$;
				response.siteId = siteId;
				log.info('NAMECHEAP buy domain DONE', response);
				DomainPurchasesCollection.insert(response);
				Sites.findOne(siteId).updateDomainStatus();
				NamecheapServices.setupDNS(response.Domain);
			})).catch(data => log.error('NAMECHEAP buy domain', response));
	},
	setupDNS(domain) {
		log.debug('NAMECHEAP setupDNS', [domain]);
		NamecheapServices.setupNamecheapDNS(domain);
		ScalingoServices.setupScalingoRouting(domain);
	},
	setupNamecheapDNS(domain) {
		log.debug('NAMECHEAP set hosts', {domain});
		namecheap.apiCall('namecheap.domains.dns.setHosts', {
			SLD: G.getDomainSLD(domain),
			TLD: G.getDomainExtension(domain),
			HostName1: '@',
			RecordType1: 'URL301',
			Address1: 'http://www.' + domain,
			TTL1: 100,
			HostName2: 'www',
			RecordType2: 'CNAME',
			Address2: 'markdownsites.scalingo.io',
			TTL2: 100
		}, G.getEnv('NAMECHEAP_SANDBOXMODE')).then(data => {
			log.info('NAMECHEAP set hosts DONE', {domain, data});
		}).catch(data => log.error("NAMECHEAP set hosts", data));

	}
}

// Get domain prices
Meteor.startup(() => {
	const dotCom = ExtensionsAvailableCollection.findOne({name: 'com'});
	if (!dotCom) {
		NamecheapServices.updateDomainPrices();
	}
	Meteor.setInterval(NamecheapServices.updateDomainPrices, 1000 * 60 * 60 * 24 * 3); // every 3 days
});