import React from 'react';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import '/imports/api/ExtensionsAvailable/main.js';
import '/imports/api/DomainPurchases/main.js';
import DomainInput from './DomainInput.jsx';

export default createContainer(({domain, siteId, onChange, name}) => {

	const extension = G.getDomainExtension(domain);
	const sub1 = Meteor.subscribe('domain-purchases', domain, siteId);
	const domainPurchase = DomainPurchasesCollection.findOne({domain, siteId});
	const sub2 = Meteor.subscribe('extensions-available', extension);
	const extensionAvailability = ExtensionsAvailableCollection.findOne({name: extension});

	return {
		domainPurchase,
		extensionAvailability,
		subReady: sub1.ready() && sub2.ready()
	};

}, DomainInput);