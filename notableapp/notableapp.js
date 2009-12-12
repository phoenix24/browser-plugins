/**
 * @author chaitanya
 */
var db;
var highestId = 0;

try {
	db = openDatabase("NotableApp", "1.0", "NotableApp Captures Table", 20000);
//	db.transaction (function(tx) {
//		tx.executeSql ("SELECT COUNT(*) FROM NotableApp", [], function(result) {
//			highestId = result.lenght === undefined ? 0 : result.lenght;
//			console.log(highestId + " records found. ");
//		}, function(tx, error) {
//			tx.executeSql("CREATE TABLE NotableApp (id REAL UNIQUE, title TEXT, url TEXT, timestamp REAL, image BLOB)", [], function(r){
//				
//			});
//		});
//	});
} catch (err) {
	console.log("failed to open the db.");
}

function Capture() {
    var self = this;
    this.view = function () {
    	// enforcing delay. SQLite is slow.
    	window.setTimeout(function(){}, 300);

    	var viewTabUrl = chrome.extension.getURL('capture.html');
        chrome.tabs.create({url: viewTabUrl, selected: true}, function(tab) {
			var views = chrome.extension.getViews();
			for (var i = 0; i < views.length; i++) {
			  var view = views[i];
			  if (view.location.href == viewTabUrl && !view.imageAlreadySet) {
			    view.setScreenshotUrl(self.image);
			    view.imageAlreadySet = true;
			    break;
			  }
			}
        });
    };
    this.log = function() {
    	console.log("object log: " + this +", "+ this.title +", "+ this.url +", "+this.image);
    };
    this.save = function() {
    	
    }
    this.remove = function() {
    	console.log("remove has been clicked ");
    };
    this.display = function () {
    	var tmp, 
    		scrshot = document.getElementsByClassName("screenshot")[0];
    	
    	tmp = scrshot.cloneNode(true);
    	tmp.className = "visible";
    	tmp.setAttribute("screenshot", "scr" + self.id);
    	tmp.getElementsByClassName("title")[0].href      = self.url;
    	tmp.getElementsByClassName("title")[0].innerHTML = self.title;
    	tmp.getElementsByClassName("thumbnail")[0].src 	 = self.image;
    	tmp.getElementsByClassName("thumbnail")[0].addEventListener("click", function() {self.view(); }, false);
    	tmp.getElementsByClassName("removebtn")[0].addEventListener("click", function() {self.remove(); }, false);
    	document.body.appendChild(tmp);
//    	updateBadgeText("0");
    };
    
    return this;
}

Capture.prototype = {
    get id() {
		if (!("_id" in this))
			this._id = 0;
        return this._id;
    },
 
    set id(x) {
        this._id = x;
    },
 
    get title() {
        if (!("_title" in this))
            this._title = 0;
        return this._title;
    },
 
    set title(x) {
        this._title = x;
    },
 	
    get url() {
        if (!("_url" in this))
            this._url = 0;
        return this._url;
    },
 
    set url(x) {
        this._url = x;
    },
 
    get image() {
        if (!("_image" in this))
            this._image = 0;
        return this._image;
    },
 
    set image(x) {
        this._image = x;
    }
};

function captureNew () {
	var image, title, url, 
		cap = new Capture();
	
	chrome.tabs.getSelected(null, function(tab) {
		cap.url = tab.url;
		cap.title = tab.title;
	});
	chrome.tabs.captureVisibleTab(null, function(img) {
		cap.image = img;
	});
	
	cap.id    = 0;//localStorage["id"]++;
//	cap.url   = localStorage["url"];
//	cap.image = localStorage["image"];
//	cap.title = localStorage["title"];

//	cap.save();
	cap.log();
	
//  enforcing a delay. SQLite seems to be sloooow!
	window.setTimeout(cap.display, 300);
}

function updateBadgeText (count) {
	chrome.browserAction.setBadgeText({
		text: count
	});
}

function init() {
	console.log("app's initialized!");
}
