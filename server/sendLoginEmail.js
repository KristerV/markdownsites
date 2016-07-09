import '/imports/G.js';
import {Accounts} from 'meteor/accounts-base';
import {Email} from 'meteor/email';

Accounts.sendLoginEmail = function (address, callback) {
	address = address.trim();

	if (!address) {
		throw new Meteor.Error(403, "No email provided");
	} else if (!G.isEmail(address)) {
		throw new Meteor.Error(403, "Provided string is not an email");
	}

	var user = Accounts.findUserByEmail(address);
	if (!user) {
		Accounts.createUser({email: address})
		user = Accounts.findUserByEmail(address)
	}
	var tokenRecord = Accounts._generateStampedLoginToken();
	Accounts._insertLoginToken(user._id, tokenRecord);

	var loginUrl = Meteor.absoluteUrl('login/' + tokenRecord.token);

	var html = `<p>Hi,</p>
	<p>To login, just follow this link.</p>
	<p><a target="_blank" href="${loginUrl}">${loginUrl}</a></p>
	<p>All the best</p>`;

	Email.send({
		from: 'no-reply@markdownsites.com',
		to: address,
		subject: 'Markdownsites.com login link',
		html: html
	});

	callback({msg: 'Login email sent', userId: user._id});

};