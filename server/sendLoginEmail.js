import '/imports/G.js';
import {Accounts} from 'meteor/accounts-base';
import {Email} from 'meteor/email';

Accounts.sendLoginEmail = function (emailAddr, callback) {
	log.info("Send login email", emailAddr);
	emailAddr = emailAddr.trim();

	check(emailAddr, String, "Invalid email provided for login-email");

	// Silently cancel sending if email string is empty
	// Let users test the site without having to commit with email
	if (emailAddr.length === 0)
		return;

	// Validate email
	if (!G.isEmail(emailAddr)) {
		throw new Meteor.Error(403, "Invalid email provided");
	}

	// If no user, create new user with email
	var user = Accounts.findUserByEmail(emailAddr);
	if (!user) {
		Accounts.createUser({email: emailAddr});
		user = Accounts.findUserByEmail(emailAddr);
	}

	// Generate login token and link
	var tokenRecord = Accounts._generateStampedLoginToken();
	Accounts._insertLoginToken(user._id, tokenRecord);
	var loginUrl = Meteor.absoluteUrl('login/' + tokenRecord.token);

	// Build email itself
	var html = `<p>Hi,</p>
	<p>To login, just follow this link.</p>
	<p><a target="_blank" href="${loginUrl}">${loginUrl}</a></p>
	<p>All the best</p>`;

	// send
	Email.send({
		from: 'no-reply@markdownsites.com',
		to: emailAddr,
		subject: 'Markdownsites.com login link',
		html: html
	});

	log.info("Login email sent", {emailAddr, loginUrl});

	if (callback)
		callback(user._id);

};