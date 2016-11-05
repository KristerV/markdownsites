Meteor.publish('extensions-available', function(name) {

	log.debug("PUBLISH extensions-available", {name});

	return ExtensionsAvailableCollection.find({name});
});