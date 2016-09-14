import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import SiteWrapper from './SiteWrapper.jsx';
import '/imports/api/sites/main.js';

export default SiteContainer = createContainer(({ siteId, content }) => {

	if (!siteId)
		return {
			site: {},
			subReady: true,
			content: content
		}

	const sitesSub = Meteor.subscribe('sites.single', siteId);
	const site = SitesCollection.findOne({
		$or: [
			{_id: siteId},
			{'editing.domain.name': siteId}
		]
	});

	return {
		site,
		subReady: sitesSub.ready(),
		content: content
	};

}, SiteWrapper);