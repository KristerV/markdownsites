Meteor.methods({
	sendEmail: function (to, subject, html) {
		check([to, html, subject], [String], 'Some email params missing');
		Email.send({
			from: 'no-reply@markdownsites.com',
			subject,
			html,
			to
		})

	},
	sendEmailLogin: function (email, callback) {
		Accounts.sendLoginEmail(email, callback);
	},
});