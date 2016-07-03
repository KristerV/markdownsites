import React from "react";
import {mount} from "react-mounter";
import MainLayout from "../ui/layouts/MainLayout.jsx";
import SiteContainer from "../ui/components/SiteContainer.jsx";
import Writer from "../ui/components/Writer.jsx";
import Settings from "../ui/components/Settings.jsx";
// import Preview from "../ui/components/Preview.jsx";

FlowRouter.route('/', {
	action: function (params, queryParams) {
		mount(MainLayout, {content: <SiteContainer/>});
	}
});

FlowRouter.route('/:siteId', {
	name: 'writer',
	action: function (params, queryParams) {
		mount(MainLayout, {content: <SiteContainer params={params} content={<Writer/>}/>});
	}
});

FlowRouter.route('/:siteId/:pageName', {
	action: function (params, queryParams) {
		let content
		switch (params.pageName) {
			case 'settings': content = <Settings params={params}/>; break;
			// case 'preview': content = <Preview params={params}/>; break;
			default: FlowRouter.go('writer', {siteId: params.siteId})
		}
		mount(MainLayout, {content: <SiteContainer params={params} content={content}/>});
	}
});