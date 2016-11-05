import React from 'react';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import '/imports/api/log/main.js';
import LogView from './LogView.jsx';

export default createContainer(() => {

	const subs = Meteor.subscribe('winstonLogs', localStorage.getItem("secretLogsKey"));
	const fetch = LogCollection.find().fetch();

	return {
		logs: fetch
	};

}, LogView);