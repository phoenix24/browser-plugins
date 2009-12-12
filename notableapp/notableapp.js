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
            for (i = 0; i < views.length; i++) {
            	var vi = views[i];
    			if (vi.location.href == viewTabUrl) {
    			    vi.setScreenshotUrl(this.image);
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
    	tmp.setAttribute("screenshot", "scr" + this.id);
    	tmp.getElementsByClassName("title")[0].href      = this.url;
    	tmp.getElementsByClassName("title")[0].innerHTML = this.title;
    	tmp.getElementsByClassName("thumbnail")[0].src 	 = this.image;
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
		localStorage["url"] = tab.url;
		localStorage["title"] = tab.title;
	});
	chrome.tabs.captureVisibleTab(null, function(img) {
		localStorage["image"] = img;
	});
	
	cap.id    = localStorage["id"]++;
	cap.url   = localStorage["url"];
	cap.image = localStorage["image"];
	cap.title = localStorage["title"];

//	cap.save();
	cap.log();
	
//  enforcing a delay. SQLite seems to be sloooow!
	window.setTimeout(function(){ cap.display(); }, 300);
}

function updateBadgeText (count) {
	chrome.browserAction.setBadgeText({
		text: count
	});
}

function init() {
	console.log("app's initialized!");
}
