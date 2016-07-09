import Alert from 'react-s-alert';

G = {
	isDefined: (variable, path) => {
		let list = path.split('.');
		for (let i = 0; i < list.length; i++) {
			variable = variable[list[i]];
			if (!variable)
				return false;
		}
		return true;
	},
	alertResult: (err, result) => {
		if (err)
			Alert.error(err.reason);
		else if (result)
			Alert.success(result);
	}
}