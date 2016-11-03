import React from 'react';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import '/imports/api/log/main.js';
import LogView from './LogView.jsx';

export default createContainer(() => {

	const sub = Meteor.subscribe('winstonLogs', localStorage.getItem("secretLogsKey"));
	const fetch = LogCollection.find({}, {limit: 1000, sort: {timestamp: -1}}).fetch();

	return {
		logs: fetch,
		subReady: sub.ready()
	};

}, LogView);