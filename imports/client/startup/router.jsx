import React from "react";
import {mount} from "react-mounter";
import EditorLayout from "../ui/layouts/EditorLayout.jsx";
import PublishedLayout from "../ui/layouts/PublishedLayout.jsx";
import SiteContainer from "../ui/components/SiteContainer.jsx";
import Writer from "../ui/components/Writer.jsx";
import About from "../ui/components/About.jsx";
import Marked from "../ui/components/Marked.jsx";

FlowRouter.route('/', {
	action: function (params, queryParams) {
		mount(EditorLayout, {content: <SiteContainer content={<Writer/>}/>});
	}
});


FlowRouter.route('/login/:token', {
	name: 'login-token',
	action: function (params) {
		Meteor.loginWithToken(params.token, function (err, result) {
			if (err) {
				sAlert.error(err.reason)
			}
			FlowRouter.go('/')
		})
	}
});

FlowRouter.route('/:siteId', {
	name: 'writer',
	action: function (params, queryParams) {
		let content;
		let layout;
		if (params.siteId === 'about') {
			layout = EditorLayout;
			content = <About/>;
		} else {
			layout = PublishedLayout;
			content = <Marked/>;
		}
		mount(layout, {content: <SiteContainer siteId={params.siteId} content={content}/>});
	}
});

FlowRouter.route('/:siteId/:pageName', {
	name: 'writer',
	action: function (params, queryParams) {
		let content;
		let layout;
		if (params.pageName === 'writer') {
			layout = EditorLayout;
			content = <Writer/>;
		} else {
			layout = PublishedLayout;
			content = <Marked/>;
		}
		mount(layout, {content: <SiteContainer siteId={params.siteId} content={content}/>});
	}
});