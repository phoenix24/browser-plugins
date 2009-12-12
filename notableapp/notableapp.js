/**
 * @author chaitanya
 */
console.log("background page - capturing the screen!");
//chrome.browserAction.onClicked.addListener(function (tab) {
//	console.log("i've been clicked : " + badgeText[position] );
//});
var notableapp = (function(){
	var db;
	var highestId = 0;
	var position  = -1;
	var badgeText = "notableapp";
	var image;
	
	function captureView () {
		//enforcing delay. SQLite is slow.
		window.setTimeout(function(){}, 300);
	    var viewTabUrl = chrome.extension.getURL('capture.html');
	    chrome.tabs.create({url: viewTabUrl, selected: true}, function(tab) {
	        var views = chrome.extension.getViews();
	        for (i = 0; i < views.length; i++) {
	        	var view = views[i];
				if (view.location.href == viewTabUrl) {
				    view.setScreenshotUrl(localStorage["image"]);
				    break;
				}
	        }
	    });
	}
	function updateBadgeText (count) {
		chrome.browserAction.setBadgeText({
			text: count
		});
	}
	function captureRemove () {
		console.log("captureRemove");
	}

//	function captureTab () {
//		
//	}
//	captureTab.prototype = {
//		id	: "",
//		url   : "",
//		title : "",
//		image : "",
//		timestamp : "",
//		save : function() {
//			var capture = this;
//			db.transaction(function(tx) {
//				tx.executeSql("INSERT INTO NotableApp (id, title, url, timestamp, image) VALUES (?, ?, ?, ?, ?)",
//				[ capture.id, capture.title, capture.url, capture.timestamp, capture.image ]);
//			});
//		}
//	}
	return {
		init : function() {
			console.log("app's initialized!");
			//initialize db.
		},
		initDB : function () {
			try {
				db = openDatabase("NotableApp", "1.0", "NotableApp Captures Table", 20000);
				if (!db) {
					console.log("failed to open the db.");
				}
				db.transaction (function(tx) {
					tx.executeSql ("SELECT COUNT(*) FROM NotableApp", [], function(){}, function(tx, error) {
						tx.executeSql("CREATE TABLE Captures (id REAL UNIQUE, title TEXT, url TEXT, timestamp REAL, image BLOB)", [], function(r){});
					});
				});
			} catch (err) {
				console.log("failed to open the db.");
			}
		},
		captureTab : function () {
			console.log("new capture ");
//			var capture = new captureTab();
//			capture.id  = ++highestId;
//			capture.timestamp = new Date().getTime();
//			chrome.tabs.getSelected(null, function(tab){//			this.captureTab ();
//			window.setTimeout(this.capturesDisplay, 300);

//				capture.url = tab.url;
//				capture.title = tab.title;
//			});
			chrome.tabs.captureVisibleTab(null, function(img){
				localStorage["image"] = img;
			});
			//enforcing a delay. SQLite seems to be sloooow!
			window.setTimeout(this.capturesDisplay, 300);
//			this.captureSave();
		},
		capturesLoad : function () {
			console.log("loading all the capture notes.");
		},
		capturesDisplay : function () {
			console.log("displaying all the captures.");
			var tmp;
			var scrshot = document.getElementsByClassName("screenshot")[0];
			
			tmp = scrshot.cloneNode(true);
			tmp.className = "visible";
//			tmp.setAttribute("screenshot", "scr" + capture.id);
//			tmp.setAttribute("details", "details" + capture.id);
			tmp.getElementsByClassName("thumbnail")[0].src = localStorage["image"];
//			tmp.getElementsByClassName("details")[0].innerHTML = capture.url;
			tmp.getElementsByClassName("removebtn")[0].addEventListener("click", captureRemove, false);
			tmp.getElementsByClassName("thumbnail")[0].addEventListener("click", captureView, false);
			document.body.appendChild(tmp);
			updateBadgeText(0);
		},
		captureSave : function () {
			console.log("saving the capture");
		},
		postCaptureTab : function () {
			
		},
		openTab : function () {
			
		},
		captureView : function () {
			console.log("capture view has been clicked.");
		}
	};
})();