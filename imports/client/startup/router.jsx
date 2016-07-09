import React from "react";
import {mount} from "react-mounter";
import MainLayout from "../ui/layouts/MainLayout.jsx";
import SiteContainer from "../ui/components/SiteContainer.jsx";
import Writer from "../ui/components/Writer.jsx";
import About from "../ui/components/About.jsx";
import Marked from "../ui/components/Marked.jsx";
import Loader from "../ui/components/Loader.jsx";
import Sites from "/imports/api/sites/Sites.js";
import Alert from 'react-s-alert';

FlowRouter.route('/', {
	action: function (params, queryParams) {
		mount(MainLayout, {content: <SiteContainer content={<Writer/>}/>});
	}
});

FlowRouter.route('/:siteId', {
	name: 'writer',
	action: function (params, queryParams) {
		mount(MainLayout, {content: <SiteContainer siteId={params.siteId} content={<Writer/>}/>});
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
		mount(MainLayout, {content: <SiteContainer siteId={params.siteId} content={content}/>});
	}
});