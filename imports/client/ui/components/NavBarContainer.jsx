import React from 'react';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import '/imports/api/sites/main.js';
import NavBar from './NavBar.jsx';

export default createContainer(() => {

	const sitesSub = Meteor.subscribe('sites.list');
	const sites = SitesCollection.find().fetch();

	return {
		sites,
		subReady: sitesSub.ready()
	};

}, NavBar);