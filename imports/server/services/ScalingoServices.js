import { HTTP } from 'meteor/http'

ScalingoServices = {
	setupRoute(domain, siteId) {
		log.debug('SCALINGO setup route', {domain, siteId});
		HTTP.call('POST',
			'https://api.scalingo.com/v1/apps/markdownsites/ExtensionsAvailable',
			{
				auth: G.getEnv('SCALINGO_USERNAME') + ":" + G.getEnv('SCALINGO_APIKEY'),
				data: {domain: {name: domain}}
			}, result => {
				log.info('SCALINGO setup route DONE', result);
			});
	}
}