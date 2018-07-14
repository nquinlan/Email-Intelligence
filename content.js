function documentInformationAgent () {

	function EICheck () {
		try {
			if(typeof window.GLOBALS == "undefined"){
				setTimeout(EICheck, 500);
			}else{
				var locationInfo = location.href.match(/\/(\w+?)$/);
				
				if(locationInfo && locationInfo[1]){

					var auth = window.GLOBALS[9],
						emailId = locationInfo[1];

					window.EIxhr = new XMLHttpRequest();
					EIxhr.onreadystatechange = function () {
						if (EIxhr.readyState == 4) {
							window.postMessage({type: "ei-mail-raw", raw: window.EIxhr.responseText  }, "*");
						}
					};

					EIxhr.open("GET", document.location.origin + document.location.pathname + "?view=om&ui=2&ik=" + auth + "&th=" + emailId, true);
					EIxhr.send();
					
				}
			}
		} catch (e) {}
	}
	
	window.onpopstate = EICheck;

	// A bad way to try to check on initial page load
	document.onload = setTimeout(EICheck, 2000);
}

// Inject Information Agent
var informationAgentScript = document.createElement('script');
informationAgentScript.appendChild(document.createTextNode('('+ documentInformationAgent +')();'));
(document.body || document.head || document.documentElement).appendChild(informationAgentScript);

window.addEventListener("message", function(event) {
	
	// Only accept messages from the window
	if (event.source != window)
		return;

	// Make sure it's the right message
	if (event.data.type && (event.data.type == "ei-mail-raw")) {

		var rawEmail = event.data.raw,
			service = {};

		// Amazon SES
		if( rawEmail.match(/^X-SES-Outgoing:/m) ) {
			service = {name: "Amazon SES", url: "http://aws.amazon.com/ses/"};
		}

		// Bronto
		if( rawEmail.match(/d=bronto.com;/) ) {
			service = {name: "Bronto", url: "http://bronto.com/"};
		}

		// Campaign Monitor
		if( rawEmail.match(/^X-Complaints-To: abuse@cmail\d{1,2}\.com/m) ) {
			service = {name: "Campaign Monitor", url: "https://www.campaignmonitor.com"};
		}

		// Constant Contact
		if( rawEmail.match(/^X-Roving-ID:/m) ) {
			service = {name: "Constant Contact", url: "https://www.constantcontact.com"};
		}

		// Dyn
		if( rawEmail.match(/^X-DynectEmail-Msg-(Key|Hash):/m) ) {
			service = {name: "Dyn", url: "https://dyn.com/"};
		}

		// Eloqua
		if( rawEmail.match(/^X-elqPod:/m) ) {
			service = {name: "Eloqua", url: "http://www.eloqua.com/"};
		}

		// Email Vision
		if( rawEmail.match(/^X-EMV-MemberId:/m) ) {
			service = {name: "Emailvision", url: "https://www.emailvision.com/"};
		}

		// Emma
		if( rawEmail.match(/d=e2ma\.net;/m) ) {
			service = {name: "Emma", url: "https://myemma.com/"};
		}

		// ExactTarget
		if( rawEmail.match(/^x-job: \d{3,}_\d{3,}$/m) && rawEmail.match(/mta[\d]*\.[\w-\.]+\.[a-z]{2,}/i) ) { // Two checks as x-job is not proprietary 
			service = {name: "ExactTarget", url: "http://www.exacttarget.com/"};
		}

		// Fishbowl
		if( rawEmail.match(/^X-Mailer: Fishbowl/m) ) {
			service = {name: "Fishbowl", url: "https://www.fishbowl.com/"};
		}

		// Gold Lasso
		if( rawEmail.match(/^X-Mailer: Eloop Mailer/m) ) {
			service = {name: "Gold Lasso", url: "https://www.goldlasso.com/"};
		}

		// Google App Engine
		if( rawEmail.match(/^X-Google-Appengine-App-Id:/m) ) {
			service = {name: "Google App Engine", url: "https://developers.google.com/appengine/docs/python/mail/sendingmail"};
		}

		// iContact
		if( rawEmail.match(/^X-ICPINFO:/m) ) {
			service = {name: "iContact", url: "https://www.icontact.com/"};
		}

		// Listrak
		if( rawEmail.match(/^Received: from [\w-]+\.listrak\.com/m) ) {
			service = {name: "Listrak", url: "https://www.listrak.com/"};
		}

		// Locaweb
		if( rawEmail.match(/^x-locaweb-id:/m) ) {
			service = {name: "Locaweb", url: "https://www.locaweb.com.br/"};
		}

		// Mailchimp
		if( rawEmail.match(/^X-MC-User:/m) ) {
			service = {name: "MailChimp", url: "https://mailchimp.com/"};
		}
		
		// MailerLite
		if( rawEmail.match(/d=ml.mailersend.com;/) ) {
			service = {name: "MailerLite", url: "https://www.mailerlite.com/"};
		}
		
		// Mailgun
		if( rawEmail.match(/^X-Mailgun-Sid:/m) ) {
			service = {name: "Mailgun", url: "https://www.mailgun.com/"};
		}

		// Mailigen
		if( rawEmail.match(/^X-Mailer: MailiGen/m) ) {
			service = {name: "Mailigen", url: "http://www.mailigen.com/"};
		}

		// Mailjet
		if( rawEmail.match(/s=mailjet;/) ) {
			service = {name: "Mailjet", url: "https://www.mailjet.com/"};
		}

		// Mandrill
		if( rawEmail.match(/^X-Mandrill-User:/m) ) {
			service = {name: "Mandrill", url: "https://mandrillapp.com/"};
		}

		// Marketo
		if( rawEmail.match(/^X-MarketoID:/m) ) {
			service = {name: "Marketo", url: "https://www.marketo.com/"};
		}

		// Message Bus
		if( rawEmail.match(/^X-Messagebus-Info:/m) ) {
			service = {name: "Message Bus", url: "https://messagebus.com/"};
		}

		// Mixmax
		if( rawEmail.match(/^X-Mailer: Mixmax/m) ) {
			service = {name: "Mixmax", url: "https://mixmax.com/"};
		}

		// Postmark
		if( rawEmail.match(/^X-PM-Message-Id:/m) ) {
			service = {name: "Postmark", url: "https://postmarkapp.com/"};
		}

		// Responsys
		if( rawEmail.match(/^X-rext:/m) ) {
			service = {name: "Responsys", url: "https://www.responsys.com/"};
		}

		// Sailthru
		if( rawEmail.match(/^X-Mailer: sailthru.com$/m) ) {
			service = {name: "Sailthru", url: "https://www.sailthru.com/"};
		}

		// Salesforce
		if( rawEmail.match(/^X-SFDC-User:/m) ) {
			service = {name: "Salesforce", url: "https://www.salesforce.com/"};
		}

		// SendGrid
		if( rawEmail.match(/^X-(SG|SENDGRID)-EID:/m) ) {
			service = {name: "SendGrid", url: "https://sendgrid.com/"};
		}

		// Silverpop
		if( rawEmail.match(/^Received: from [\w\.]+\.mkt\d{3,}\.com/m) ) { // Not proprietary, but likely only Silverpop
			service = {name: "Silverpop", url: "https://www.silverpop.com/"};
		}

		// SMTP.com
		if( rawEmail.match(/^X-SMTPCOM-Tracking-Number:/m) ) {
			service = {name: "SMTP.com", url: "https://smtp.com/"};
		}

		// VerticalResponse
		if( rawEmail.match(/^X-vrfbldomain:/m) && rawEmail.match(/^X-vrpod:/m) && rawEmail.match(/^X-vrrpmm:/m) ) {
			service = {name: "VerticalResponse", url: "http://www.verticalresponse.com/"};
		}

		// Yesmail
		if( rawEmail.match(/s=yesmail.?;/)  || rawEmail.match(/^Received: from [\w\.\-]+postdirect.com/m) ) {
			service = {name: "Yesmail", url: "https://www.yesmail.com/"};
		}

		if(service.name){
			service.icon = chrome.extension.getURL("providers/" + service.name.toLowerCase().replace(/\s/g,"-") + ".png");

			// Remove any current icon
			var currentIcon = document.getElementById("EIicon");
			if(currentIcon){
				currentIcon.parentNode.removeChild(currentIcon);
			}

			// Attempt to find the place to put the icon in the gmail interface
			var has = document.getElementsByClassName("ha");
			for (var i = has.length - 1; i >= 0; i--) {
				if(has[i].getElementsByTagName("span")){

					var serviceLink = document.createElement("a");
					serviceLink.setAttribute("id", "EIicon");
					serviceLink.setAttribute("href", service.url);
					serviceLink.setAttribute("title", service.name);
					serviceLink.setAttribute("style", "border:0");

					var serviceIcon = document.createElement("img");
					serviceIcon.setAttribute("src", service.icon);
					serviceIcon.setAttribute("style", "top:1px");

					serviceLink.appendChild(serviceIcon);
					
					has[i].getElementsByTagName("span")[0].appendChild(serviceLink);
					return;
				}
			}
		}

	}
}, false);
