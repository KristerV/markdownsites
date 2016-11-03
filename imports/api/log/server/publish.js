Meteor.publish('winstonLogs', function(key) {
	log.debug("PUBLISH winstonLogs", {userId: this.userId, key});

	if (key === 'wzb4XiA8AdCdKCeG3Eqn')
		return LogCollection.find();
});