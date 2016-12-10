User = {
	getEmail: function() {
		if (this.emails) {
			return this.emails[0].address;
		} else {
			return null
		}
	},

	getName: function() {
		return G.ifDefined(this, 'profile.name', "");
	},
};

Meteor.users._transform = function(doc) {
	doc.__proto__ = User;
	return doc;
}