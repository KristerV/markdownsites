window.Tawk_API = window.Tawk_API || false;

if (!Meteor.isDev && !window.Tawk_API) {
	var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
	s1.async=true;
	s1.src='https://embed.tawk.to/582f1347397ff569a3d217f7/default';
	s1.charset='UTF-8';
	s1.setAttribute('crossorigin','*');
	s0.parentNode.insertBefore(s1,s0);

	function tawkTimeout() {
		if (Meteor.isDev) return
		const user = Meteor.user()
		if (user && user.getEmail() && window.Tawk_API) {
			const name = user.getName()
			const email = user.getEmail()
			window.Tawk_API.setAttributes({name1: name}) // just name doesn't work
			window.Tawk_API.setAttributes({email1: email}) // just email doesn't work
			window.Tawk_API.setAttributes({'user-id': Meteor.userId()})
		} else {
			Meteor.setTimeout(tawkTimeout, 1000)
		}
	}
	tawkTimeout();
}