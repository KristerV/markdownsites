import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import SiteWrapper from './SiteWrapper.jsx';
import '/imports/api/sites/main.js';

export default SiteContainer = createContainer(({ siteId, content, domain }) => {

	const sitesSub = Meteor.subscribe('sites.single', siteId, domain);
	const site = SitesCollection.findOne({$or: [{_id: siteId}, {domain: domain}]});

	return {
		site,
		subReady: sitesSub.ready(),
		content: content
	};

}, SiteWrapper);