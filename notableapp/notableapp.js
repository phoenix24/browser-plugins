/**
 * @author chaitanya
 */
var db;
var highestId = 0;

var image, url, title;

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
    
    var capture = document.createElement('div');
    capture.className = 'visible';
    this.capture = capture;
 
    var thumbnail = document.createElement('img');
    close.height = '75';
    close.width = '75';
// close.addEventListener('click', function(event) { return self.close(event) }, false);
    capture.appendChild(thumbnail);

    var details = document.createElement('div');
    details.className ='details';
    capture.appendChild(details);
 
    var buttons = document.createElement('div');
    buttons.className ='btns';
    capture.appendChild(buttons);
 
    var addnotes = document.createElement('input');
    addnotes.className ='addbtn';
    addnotes.type = 'button';
    addnotes.value = 'add notes';
    buttons.appendChild(addnotes);
 	
    var removenotes = document.createElement('input');
    removenotes.className ='removebtn';
    addnotes.type = 'button';
    addnotes.value = 'remove';
    buttons.appendChild(removenotes);
    return this;
}

Capture.prototype = {
    get id()
    {
		if (!("_id" in this))
			this._id = 0;
        return this._id;
    },
 
    set id(x)
    {
        this._id = x;
    },
 
    get title()
    {
        if (!("_title" in this))
            this._title = 0;
        return this._title;
    },
 
    set title(x)
    {
        this._title = x;
    },
 	
    get url()
    {
        if (!("_url" in this))
            this._url = 0;
        return this._url;
    },
 
    set url(x)
    {
        this._url = x;
    },
 
    get image()
    {
        if (!("_image" in this))
            this._image = 0;
        return this._image;
    },
 
    set image(x)
    {
        this._image = x;
    },
 	
    save: function()
    {
		
    },
    
    remove : function() {
    	console.log("remove has been clicked ");
    },
    
    display : function() {
    	console.log("displaying all the captures.");
    	var tmp, 
    		scrshot = document.getElementsByClassName("screenshot")[0];
    	
    	tmp = scrshot.cloneNode(true);
    	tmp.className = "visible";
    	tmp.setAttribute("screenshot", "scr" + this.id);
    	tmp.getElementsByClassName("details")[0].innerHTML = this.title;
    	tmp.getElementsByClassName("thumbnail")[0].src = this.image; //localStorage["image"];
    	tmp.getElementsByClassName("thumbnail")[0].addEventListener("click", this.view, false);
    	tmp.getElementsByClassName("removebtn")[0].addEventListener("click", this.remove, false);
    	document.body.appendChild(tmp);
//    	updateBadgeText("0");
    },

    onCaptureClick: function(e) {
		
    },
    
    log : function() {
    	console.log("object log: " + this.id +", "+ this.title +", "+ this.url +", "+this.image);
    },
    
    view : function() {
    	// enforcing delay. SQLite is slow.
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
};

//function captureView () {
//	// enforcing delay. SQLite is slow.
//	window.setTimeout(function(){}, 300);
//    var viewTabUrl = chrome.extension.getURL('capture.html');
//    chrome.tabs.create({url: viewTabUrl, selected: true}, function(tab) {
//        var views = chrome.extension.getViews();
//        for (i = 0; i < views.length; i++) {
//        	var view = views[i];
//			if (view.location.href == viewTabUrl) {
//			    view.setScreenshotUrl(localStorage["image"]);
//			    break;
//			}
//        }
//    });
//}

function captureNew () {
	var image, title, url, 
		cap = new Capture();
	
	cap.id  = ++highestId;
	chrome.tabs.getSelected(null, function(tab) {
		url = tab.url;
 		title = tab.title;
//		console.log("tab data: " + tab.title +", "+ tab.url +", ");
	});
	chrome.tabs.captureVisibleTab(null, function(img) {
		image = img;
		localStorage["image"] = img;
//		console.log("new capture image assigning" + image);
	});
	console.log("new capture image assigning : " + image);
	
	cap.url = url;
	cap.image = image;
	cap.title = title;
	// cap.save();
	cap.log();
	console.log("console LOG: " + cap.id +", "+ cap.title +", "+ cap.url +", "+cap.image);

	// enforcing a delay. SQLite seems to be sloooow!
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
