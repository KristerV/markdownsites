import React from "react";
import {mount} from "react-mounter";
import EditorLayout from "../ui/layouts/EditorLayout.jsx";
import PublishedLayout from "../ui/layouts/PublishedLayout.jsx";
import SiteContainer from "../ui/components/SiteContainer.jsx";
import Writer from "../ui/components/Writer.jsx";
import About from "../ui/components/About.jsx";
import Marked from "../ui/components/Marked.jsx";
import Loader from "../ui/components/Loader.jsx";
import Sites from "/imports/api/sites/Sites.js";
import Alert from 'react-s-alert';

FlowRouter.route('/', {
	action: function (params, queryParams) {
		mount(EditorLayout, {content: <SiteContainer content={<Writer/>}/>});
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