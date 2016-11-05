import { HTTP } from 'meteor/http';
import DomainPurchaseService from './DomainPurchaseService';

export default {
	setupRoute(domain, siteId) {
		log.debug('SCALINGO setup route', {domain, siteId});
		DomainPurchaseService.setStep(domain, siteId, 'setScalingoRouteStart');
		HTTP.call('POST',
			'https://api.scalingo.com/v1/apps/markdownsites/domains',
			{
				auth: G.getEnv('SCALINGO_USERNAME') + ":" + G.getEnv('SCALINGO_APIKEY'),
				data: {domain: {name: domain}}
			}, result => {
				log.info('SCALINGO setup route DONE', result);
				DomainPurchaseService.setStep(domain, siteId, 'setScalingoRouteDone');
				DomainPurchaseService.startNextStep(domain, siteId);
			});
	}
}