import Alert from 'react-s-alert';

Sites = {
	useResults: (err, res) => {
		if (err) {
			Alert.error(err.reason);
			console.error(err)
		} else if (res) {
			if (_.isObject(res)) {
				if (res.newId)
					FlowRouter.go('writer', {siteId: res.newId});
				if (res.msg)
					Alert.success(res.msg);
			}
		}
	}
}