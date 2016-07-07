Sites = {
	createNew: () => {
		let userId = Meteor.userId();
		if (userId) {
			console.log("do new");
			Meteor.call('sites.new', userId, (err, result) => {
				if (err) {
					Alert.error(err.reason);
				} else {
					FlowRouter.go(`/${result}`)
				}
			});
		} else {
			console.log("wait");
			Meteor.setTimeout(Sites.createNew, 200);
		}
	} 
}