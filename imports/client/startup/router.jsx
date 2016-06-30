import React from 'react';
import {mount} from 'react-mounter';
import MainLayout from '../ui/layouts/MainLayout.jsx';

FlowRouter.route('/', {
	action: function (params, queryParams) {
		mount(MainLayout);
	}
});