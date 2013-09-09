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

		window.rawEmail = rawEmail;

		if( rawEmail.match(/^X-(SG|SENDGRID)-EID:/m) ) {
			service = {name: "SendGrid", url: "https://sendgrid.com/"};
		}else if( rawEmail.match(/^X-Mandrill-User:/m) ) {
			service = {name: "Mandrill", url: "https://mandrillapp.com/"};
		}else if( rawEmail.match(/^X-MC-User:/m) ) {
			service = {name: "MailChimp", url: "https://mailchimp.com/"};
		}else if( rawEmail.match(/s=mailjet;/) ) {
			service = {name: "Mailjet", url: "https://www.mailjet.com/"};
		}else if( rawEmail.match(/^X-SES-Outgoing:/m) ) {
			service = {name: "Amazon SES", url: "http://aws.amazon.com/ses/"};
		}else if( rawEmail.match(/^X-PM-Message-Id:/m) ) {
			service = {name: "Postmark", url: "https://postmarkapp.com/"};
		}else if( rawEmail.match(/^X-Mailgun-Sid:/m) ) {
			service = {name: "Mailgun", url: "https://www.mailgun.com/"};
		}else if( rawEmail.match(/^X-Roving-ID:/m) ) {
			service = {name: "Constant Contact", url: "https://www.constantcontact.com"};
		}else if( rawEmail.match(/^X-ICPINFO:/m) ) {
			service = {name: "iContact", url: "https://www.icontact.com/"};
		}else if( rawEmail.match(/d=bronto.com;/) ) {
			service = {name: "Bronto", url: "http://bronto.com/"};
		}else if( rawEmail.match(/^X-MarketoID:/m) ) {
			service = {name: "Marketo", url: "https://www.marketo.com/"};
		}else if( rawEmail.match(/^X-DynectEmail-Msg-Key:/m) ) {
			service = {name: "Dyn", url: "https://dyn.com/"};
		}else if( rawEmail.match(/^X-SMTPCOM-Tracking-Number:/m) ) {
			service = {name: "SMTP.com", url: "https://smtp.com/"};
		}else if( rawEmail.match(/^X-SFDC-User:/m) ) {
			service = {name: "Salesforce", url: "https://www.salesforce.com/"};
		}else if( rawEmail.match(/^x-job: \d{3,}_\d{3,}$/m) && rawEmail.match(/mta[\d]*\.[\w-\.]+\.[a-z]{2,}/i) ) { // Two checks as x-job is not proprietary 
			service = {name: "ExactTarget", url: "http://www.exacttarget.com/"};
		}else if( rawEmail.match(/^X-Mailer: MailiGen/m) ) {
			service = {name: "Mailigen", url: "http://www.mailigen.com/"};
		}

		if(service.name){
			service.icon = chrome.extension.getURL("providers/" + service.name.toLowerCase().replace(" ","-") + ".png");

			// Remove any current icon
			var currentIcon = document.getElementById("EIicon");
			if(currentIcon){
				currentIcon.parentNode.removeChild(currentIcon);
			}

			// Attempt to find the place to put the icon in the gmail interface
			var h1s = document.getElementsByTagName("h1");
			for (var i = h1s.length - 1; i >= 0; i--) {
				if(h1s[i].getAttribute("class") && h1s[i].getAttribute("class").match("ha")){

					var serviceLink = document.createElement("a");
					serviceLink.setAttribute("id", "EIicon");
					serviceLink.setAttribute("href", service.url);
					serviceLink.setAttribute("title", service.name);
					serviceLink.setAttribute("style", "border:0");

					var serviceIcon = document.createElement("img");
					serviceIcon.setAttribute("src", service.icon);
					serviceIcon.setAttribute("style", "top:1px");

					serviceLink.appendChild(serviceIcon);
					

					h1s[i].appendChild(serviceLink);
					return;
				}
			}
		}

	}
}, false);