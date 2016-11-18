import React from "react";
import {mount} from "react-mounter";
import EditorLayout from "../ui/layouts/EditorLayout.jsx";
import PublishedLayout from "../ui/layouts/PublishedLayout.jsx";
import SiteContainer from "../ui/components/SiteContainer.jsx";
import Writer from "../ui/components/Writer.jsx";
import PublishedContent from "../ui/components/PublishedContent.jsx";
import LogViewContainer from "../ui/components/LogViewContainer.jsx";
import Alert from 'react-s-alert';

// static pages
import PageAbout from "../ui/components/PageAbout.jsx";
import PageMarkdown from "../ui/components/PageMarkdown.jsx";
import PagePolicy from "../ui/components/PagePolicy.jsx";
import PageLogin from "../ui/components/PageLogin.jsx";

FlowRouter.route('/', {
	name: 'home',
	action: function (params, queryParams) {
		console.log(params, queryParams);
		mount(EditorLayout, {content: <SiteContainer content={<Writer/>}/>});
	}
});


FlowRouter.route('/login/:token', {
	name: 'login-token',
	action: function (params) {
		Meteor.loginWithToken(params.token, function (err, result) {
			if (err) {
				Alert.error(err.reason)
			}
			FlowRouter.go('/')
		})
	}
});

FlowRouter.route('/logs', {
	name: 'logs',
	action: function (params, queryParams) {
		mount(LogViewContainer);
	}
});

FlowRouter.route('/:siteId', {
	name: 'page',
	action: function (params, queryParams) {
		let content;
		let layout = EditorLayout;
		switch (params.siteId) {
			case 'markdown':
				content = <PageMarkdown/>;
				break;
			case 'customdomain':
				content = <PageCustomDomain/>;
				break;
			case 'policy':
				content = <PagePolicy/>;
				break;
			case 'about':
				content = <PageAbout/>;
				break;
			case 'login':
				content = <PageLogin/>;
				break;
			default:
				layout = PublishedLayout;
				content = <PublishedContent/>;

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
			content = <PublishedContent/>;
		}
		mount(layout, {content: <SiteContainer siteId={params.siteId} content={content}/>});
	}
});