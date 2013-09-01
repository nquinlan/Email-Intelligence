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
	
	// Perhaps this is better to move into an event listener on the Extension Side
	window.EILastLocation = document.location.href;
	setInterval(function () {
		if(window.EILastLocation != document.location.href){
			window.EILastLocation = document.location.href;
			EICheck();
		}
	}, 250);

	EICheck();
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
			service = {name: "iContact", url: "http://www.icontact.com/"};
		}

		if(service.name){
			service.icon = chrome.extension.getURL("providers/" + service.name.toLowerCase().replace(" ","-") + ".png");

			// Remove any current icon
			var currentIcon = document.getElementById("EIicon");
			if(currentIcon){
				element.parentNode.removeChild(currentIcon);
			}

			// Attempt to find the place to put the icon in the gmail interface
			var h1s = document.getElementsByTagName("h1");
			for (var i = h1s.length - 1; i >= 0; i--) {
				if(h1s[i].getAttribute("class").match("ha")){

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