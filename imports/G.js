G = {
	isDefined: (variable, path) => {
		let list = path.split('.');
		for (let i = 0; i < list.length; i++) {
			variable = variable[list[i]];
			if (!variable)
				return false;
		}
		return true;
	}
}