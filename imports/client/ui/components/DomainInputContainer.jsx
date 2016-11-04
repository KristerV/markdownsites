import React from 'react';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import '/imports/api/ExtensionsAvailable/main.js';
import '/imports/api/DomainPurchases/main.js';
import DomainInput from './DomainInput.jsx';

export default createContainer(({domain, onChange, name}) => {

	const extension = G.getDomainExtension(domain);
	const sub1 = Meteor.subscribe('domain-purchases');
	const domainPurchase = DomainPurchasesCollection.findOne({domain});
	const sub2 = Meteor.subscribe('domains-available');
	const extensionAvailability = ExtensionsAvailableCollection.findOne({extension});

	return {
		domainPurchase,
		extensionAvailability,
		subReady: sub1.ready() && sub2.ready()
	};

}, DomainInput);