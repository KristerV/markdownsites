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
	name: 'published',
	action: function (params, queryParams) {
		mount(PublishedLayout, {content: <SiteContainer siteId={params.siteId} content={<Marked/>}/>});
	}
});

FlowRouter.route('/:siteId/writer', {
	name: 'writer',
	action: function (params, queryParams) {
		mount(EditorLayout, {content: <SiteContainer siteId={params.siteId} content={<Writer/>} source="editing"/>});
	}
});

FlowRouter.route('/:siteId/:pageName', {
	action: function (params, queryParams) {
		let content
		switch (params.pageName) {
			case 'preview':
				content = <Marked/>;
				break;
			case 'about':
				content = <About/>;
				break;
			default:
				content = <Writer/>
		}
		mount(EditorLayout, {content: <SiteContainer siteId={params.siteId} content={content}/>});
	}
});