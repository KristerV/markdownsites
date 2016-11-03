import winston from 'winston';
import '../imports/G';
import 'winston-mongodb';

log = new (winston.Logger)({
	level: 'debug',
	transports: [
		new (winston.transports.Console)(),
		new winston.transports.MongoDB({
			db: G.getEnv('MONGO_URL'),
			level: 'debug',
			capped: true,
			collection: 'winstonLogs',
			handleExceptions: true
		})
	],
	exitOnError: false
});
log.info("APPRESTARTED");