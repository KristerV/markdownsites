import { HTTP } from 'meteor/http';
import DomainPurchaseService from './DomainPurchaseService';

ScalingoServices = {
	setupRoute(domain, siteId) {
		log.debug('SCALINGO setup route', {domain, siteId});
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