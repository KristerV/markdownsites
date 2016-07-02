import React from "react";
import {mount} from "react-mounter";
import MainLayout from "../ui/layouts/MainLayout.jsx";
import WriterContainer from "../ui/components/WriterContainer.jsx";

FlowRouter.route('/', {
	action: function (params, queryParams) {
		mount(MainLayout, {content: <WriterContainer/>});
	}
});

FlowRouter.route('/:siteId', {
	action: function (params, queryParams) {
		mount(MainLayout, {content: <WriterContainer params={params}/>});
	}
});