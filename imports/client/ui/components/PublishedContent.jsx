import React from 'react';
import MarkdownIt from 'markdown-it';
import mitTOC from 'markdown-it-table-of-contents';
import mitAnchor from 'markdown-it-anchor';
import string from 'string';

export default class extends React.Component {
	constructor(props) {
		super(props);
		this.sluggedTitles = {};
		this.markit = new MarkdownIt({
			linkify: true,
			breaks: true,
		})
			.use(mitAnchor)
			.use(mitTOC, {
				includeLevel: [1, 2, 3, 4, 5],
				slugify: function(str) {
					let slug = string(str).slugify().toString();
					let appendix = "";
					if (isNaN(Number(this.sluggedTitles[slug]))) {
						this.sluggedTitles[slug] = 1;
					} else {
						this.sluggedTitles[slug]++;
						appendix = '-' + this.sluggedTitles[slug];
					}
					return slug + appendix;
				}.bind(this)
			});
		this.toggleMenu = this.toggleMenu.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
		this.refreshTOC = this.refreshTOC.bind(this);
		this.state = {
			menuRevealed: false
		}
	}

	componentDidMount() {

		// Scroll into position after  content has loaded
		if( window.location.hash != '' ){
			var anchor = $( location.hash ).get(0);
			if(anchor){
				anchor.scrollIntoView();
				document.body.scrollTop -= 25;
			}
		}

		// Find title visible on screen
		this.timer = Meteor.setInterval(() => {

			var winTop = $('body').scrollTop();
			var winHeight = $(window).height();
			var headers = $(':header:not(.table-of-contents)');

			// Find first visible
			var firstVisible;
			for (var i = 0; i < headers.length; i++) {
				var elem = $(headers[i]);
				var top = elem.position().top;
				if (top < winTop)
					firstVisible = elem;
				else
					break;
			}

			// Change hash
			var topic = '';
			if (firstVisible) {
				topic = firstVisible.attr("id");
			}
			history.replaceState(null, null, '#'+topic);
			this.refreshTOC();
		},1000);

		// Change menu when menu is clicked
		$(window).on('hashchange',() => {
			this.refreshTOC();
		});
	}

	componentWillUnmount() {
		Meteor.clearInterval(this.timer);
		$(window).off('hashchange');
	}

	refreshTOC() {
		// Collapse menu
		$('.table-of-contents .active').removeClass('active');

		// Get hash from URL
		var placeholder = location.hash.slice(1);
		var link = $('.table-of-contents a[href="#'+placeholder+'"]');

		// Mark link and reveal parent ul's
		link.addClass('active').parents('ul:not(.table-of-contents > ul)').addClass('active');

		// Get link clicked and reveal menu under it (it's actually next to it)
		var nextUl = link.parent('li').addClass('active');

		// If no direct li's, reveal next ul's
		var children = nextUl.children();
		var isLi = false
		for (var i = 0; i < children.length; i++) {
			if (children[i].tagName === 'LI') {
				isLi = true;
				break;
			}
		}
		if (!isLi) {
			nextUl.children('ul').addClass('active');
		}
	}

	toggleMenu() {
		this.setState({menuRevealed: !this.state.menuRevealed});
	}

	render() {
		this.sluggedTitles = {};
		const markdown = G.ifDefined(this, 'props.content') || G.ifDefined(this, 'props.site.content');
		const html = this.markit.render("[[toc]]\n" + markdown);
		return (<div className={"PublishedContent" + (this.state.menuRevealed ? ' revealed' : '')}>
			<button className={"revealer button ui" + (this.state.menuRevealed ? '' : ' basic')} onClick={this.toggleMenu}>MENU</button>
			<div dangerouslySetInnerHTML={{__html: html}}></div>
			<div className="shade" onClick={this.toggleMenu}></div>
		</div>);
	}
}