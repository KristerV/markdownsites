import '../ui/styles/dev.less';
import '../ui/styles/elements.less';
import '../ui/styles/font.less';
import '../ui/styles/helpers.less';
import '../ui/styles/layout.less';
import '../ui/styles/logtable.less';
import '../ui/styles/writer.less';
import '../ui/styles/PublishedContent.less';

import '../../api/users/main.js';
import './router.jsx';

Meteor.startup(()=> {
	(function(h,o,t,j,a,r){
		h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
		h._hjSettings={hjid:421790,hjsv:5};
		a=o.getElementsByTagName('head')[0];
		r=o.createElement('script');r.async=1;
		r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
		a.appendChild(r);
	})(window,document,'//static.hotjar.com/c/hotjar-','.js?sv=');
})