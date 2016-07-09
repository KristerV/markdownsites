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

	// Force url to use domain instead of _id
	if (G.isDefined(site, 'editing.domain') && site.editing.domain !== FlowRouter.getParam('siteId'))
		FlowRouter.go('writer', {siteId: site.editing.domain});

	return {
		site,
		subReady: sitesSub.ready(),
		content: content
	};

}, SiteWrapper);