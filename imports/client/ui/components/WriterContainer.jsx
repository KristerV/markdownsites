import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Writer from './Writer.jsx';
import '/imports/api/sites/collection.js';

export default WriterContainer = createContainer(({ params }) => {
	params = params || {};
	const siteId = params.siteId;

	// Create new site
	if (!siteId) {
		Meteor.call('sites.new', (err, result) => {
			if (err)
				console.warn(err);
			else
				FlowRouter.go(`/${result}`)
		});
		return {subReady: false}
	}

	// Return site data
	else {
		const sitesSub = Meteor.subscribe('sites.single', siteId);
		const site = SitesCollection.findOne();
		return {
			site,
			subReady: sitesSub.ready()
		};
	}

}, Writer);