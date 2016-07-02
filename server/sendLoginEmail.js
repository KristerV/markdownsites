Accounts.sendLoginEmail = function (address) {

	if (!address) {
		throw new Meteor.Error("No email provided");
	} else if (!/^[^@]+@[^@]+\.[^@]+$/.test(address)) {
		throw new Meteor.Error("Provided string is not an email");
	}

	var user = Accounts.findUserByEmail(address);

	if (!user) {
		Accounts.createUser({email: address})
		user = Accounts.findUserByEmail(address)
	}

	var tokenRecord = Accounts._generateStampedLoginToken();
	Accounts._insertLoginToken(user._id, tokenRecord);

	var loginUrl = Meteor.absoluteUrl('login/' + tokenRecord.token);
	console.info(loginUrl);

	var html = `<p>Hi,</p>
	<p>To login, just follow this link.</p>
	<p><a target="_blank" href="' + loginUrl + '">' + loginUrl + '</a></p>
	<p>All the best</p>`;

	Email.send({
		from: Settings.system_email,
		to: address,
		subject: 'Markdownsites.com login link',
		html: html
	});
};