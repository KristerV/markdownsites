import Alert from 'react-s-alert';

// G as in Global helpers
G = {
	isDefined: (variable, path) => {
		let list = path.split('.');

		if (!variable)
			return false;

		for (let i = 0; i < list.length; i++) {
			variable = variable[list[i]];
			if (!variable)
				return false;
		}

		return variable;
	},
	alertResult: (err, result) => {
		if (err)
			Alert.error(err.reason);
		else if (result)
			Alert.success(result);
	},
	ifDefined: (variable, path, ifNot) => {
		const result = G.isDefined(variable, path);
		ifNot = ifNot || null;
		return result ? result : ifNot;
	},
	getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	getFullUrl(route, params) {
		let path;
		if (!route)
			path = FlowRouter.current().path;
		else if (Meteor.isClient)
			path = FlowRouter.path(route, params);
		else
			path = route;

		return Meteor.absoluteUrl().slice(0, -1) + path

	},
	rmTrailing(str, trail) {
		if (!str || !trail) throw new Meteor.Error(`rmTrailing something missing: ${str}, ${trail}`)
		if (str.substr(-1) === trail) {
			return str.substr(0, str.length - 1);
		}
		return str;
	},
	rmBothSlashes(str) {
		return str.replace(/^\/|\/$/g, '');
	},
	error(msg) {
		console.error(msg);
		var e = new Error(msg);
		var stack = e.stack.replace(/^[^\(]+?[\n$]/gm, '')
			.replace(/^\s+at\s+/gm, '')
			.replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@')
			.split('\n');
		console.info(stack)
	},
	isEmail(email) {
		return /^[^@]+@[^@]+\.[^@]+$/.test(email)
	},
	getEnv(variable) {
		return process.env[variable] || Meteor.settings[variable]
	}
}