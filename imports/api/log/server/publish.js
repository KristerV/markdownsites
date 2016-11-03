Meteor.publish('winstonLogs', function(key) {
	log.debug("Publish winstonLogs", this.userId, key);

	if (key === 'wzb4XiA8AdCdKCeG3Eqn')
		return LogCollection.find();
});