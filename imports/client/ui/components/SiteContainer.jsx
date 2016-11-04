import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import SiteWrapper from './SiteWrapper.jsx';
import '/imports/api/sites/main.js';

export default SiteContainer = createContainer(({ siteId, content }) => {

	const sitesSub = Meteor.subscribe('sites.single', siteId);
	const site = SitesCollection.findOne(siteId);

	return {
		site,
		subReady: sitesSub.ready(),
		content: content
	};

}, SiteWrapper);