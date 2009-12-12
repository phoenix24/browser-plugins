/**
 * @author chaitanya
 */
var db;
var image;
var position  = -1;
var highestId = 0;
var badgeText = "notableapp";

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

function Note1() {
    var self = this;
    var note = document.createElement('div');
    this.note = note;
    return this;
}
Note1.prototype = {
    get id(){
        if (!("_id" in this)) 
            this._id = 0;
        return this._id;
    },
    
     set id(x){
        this._id = x;
    },
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
    
    this.url = "no url";
    this.title = "no title";
    this.image = "no image";
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
        return this.title;
    },
 
    set title(x)
    {
        this.title = x;
    },
 	
    get url()
    {
        return this.url;
    },
 
    set url(x)
    {
        this.url = x;
    },
 
    get image()
    {
        return this.image;
    },
 
    set image(x)
    {
        this.image = x;
    },
 	
    save: function()
    {
		
    },
 
    onCaptureClick: function(e)
    {
		
    }
};

function captureView () {
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

function updateBadgeText (count) {
	chrome.browserAction.setBadgeText({
		text: count
	});
}

function init() {
	console.log("app's initialized!");
}

function captureNew () {
	console.log("new capture ");
	var cap = new Capture();
	console.log("new capture.. ");
	// cap.id = ++highestId;
	// cap.timestamp = new Date().getTime();
	// console.log("new capture ");
	chrome.tabs.getSelected(null, function(tab) {
	// cap.url = tab.url;
	// cap.title = tab.title;
		console.log(tab.title +", "+ tab.url +", ");
	});
	console.log("new capture ");
	chrome.tabs.captureVisibleTab(null, function(img) {
	// cap.image = img;
		localStorage["image"] = img;
	});
	console.log("new capture ");
	
	// the tab has been captured, lets save it.
	console.log("about to save the captures...");
	// cap.save();
	// cap.log();
	// console.log(cap.id +", "+ cap.title +", "+ cap.url +", "+
	// cap.timestamp +", ");

	// enforcing a delay. SQLite seems to be sloooow!
	window.setTimeout(this.capturesDisplay, 300);
}

function capturesLoad() {
	console.log("loading all the capture notes.");
	return captures;
}

function capturesDisplay() {
	var tmp;
	var scrshot = document.getElementsByClassName("screenshot")[0];
	console.log("displaying all the captures.");
	
	tmp = scrshot.cloneNode(true);
	tmp.className = "visible";
	// tmp.setAttribute("screenshot", "scr" + capture.id);
	// tmp.setAttribute("details", "details" + capture.id);
	tmp.getElementsByClassName("thumbnail")[0].src = localStorage["image"];
	// tmp.getElementsByClassName("details")[0].innerHTML = capture.url;
	// tmp.getElementsByClassName("removebtn")[0].addEventListener("click", captureRemove, false);
	tmp.getElementsByClassName("thumbnail")[0].addEventListener("click", captureView, false);
	document.body.appendChild(tmp);
	updateBadgeText("0");
}
