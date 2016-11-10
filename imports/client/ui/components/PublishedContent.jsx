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
		this.state = {
			menuRevealed: false
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
			<div onClick={this.toggleMenu} dangerouslySetInnerHTML={{__html: html}}></div>
			<div className="shade" onClick={this.toggleMenu}></div>
		</div>);
	}
}