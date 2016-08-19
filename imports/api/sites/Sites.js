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
				
				let alertOptions = {
					html: true
				}
				if (res.timeout) alertOptions.timeout = res.timeout
				if (res.msg)
					Alert.success(res.msg, alertOptions);
			}
		}
	},
	setDomainChecking(siteId) {
		Sites.update(siteId, {$set: {
			'editing.domain.isAvailable': null,
			'editing.domain.msg': null,
			'editing.domain.isChecking': true
		}});
	},
	setDomainAvailability(siteId, available, price) {
		Sites.update(siteId, {$set: {
			'editing.domain.isAvailable': available,
			'editing.domain.price': price,
			'editing.domain.msg': null,
			'editing.domain.isChecking': false
		}});
	},
	setDomainError(siteId, msg) {
		Sites.update(siteId, {$set: {
			'editing.domain.isAvailable': null,
			'editing.domain.msg': msg,
			'editing.domain.isChecking': false
		}});
	},
}