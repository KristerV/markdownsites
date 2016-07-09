import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import SiteWrapper from './SiteWrapper.jsx';
import '/imports/api/sites/collection.js';

export default SiteContainer = createContainer(({ siteId, content }) => {

	if (!siteId)
		return {
			site: {},
			subReady: true,
			content: content
		}

	const sitesSub = Meteor.subscribe('sites.single', siteId);
	const site = SitesCollection.findOne();
	return {
		site,
		subReady: sitesSub.ready(),
		content: content
	};

}, SiteWrapper);