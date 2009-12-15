/**
 * @author chaitanya
 */
var db = notableapp.init();

function Capture() {
	var self 	= this;
    this.db 	= db;
    
    console.log("db : " + this.db);
    
    this.view = function (evt) {
    	console.log("veiwing the image" + evt);
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
        console.log("object log: "+ self.title +", "+ self.url);
    };
    this.save = function() {
        var cap = this;
//        console.log("object save: " + cap.title +", "+ cap.url +", " + cap.image);
        self.db.transaction(function(tx){
            tx.executeSql("INSERT INTO NotableApp (title, url, image) VALUES (?, ?, ?)", [cap.title, cap.url, cap.image]);
        });
    };
    this.remove = function(evt) {
        console.log("remove has been clicked " + evt.parentNode.parentNode);
    };
    this.display = function () {

        var tmp, scrshot = document.getElementsByClassName("screenshot")[0];
        self.db.transaction(function(tx){
            tx.executeSql("SELECT id, title, url, image FROM NotableApp", [], function(tx, result){
                for (var i = 0; i < result.rows.length; ++i) {
                    var row = result.rows.item(i);
                    var cap = new Capture();
                    cap.id  = row['id'];
                    cap.url = row['url'];
                    cap.title = row['title'];
                    cap.image = row['image'];
                    console.log("object saved: "+ cap.title +", "+ cap.url +", " + cap.image);

                    tmp = scrshot.cloneNode(true);
                    tmp.className = "visible";
                    tmp.setAttribute("screenshot", cap.id);
                    tmp.getElementsByClassName("title")[0].href      = cap.url;
                    tmp.getElementsByClassName("title")[0].innerHTML = cap.title;
                    tmp.getElementsByClassName("thumbnail")[0].src   = cap.image;
                    tmp.getElementsByClassName("thumbnail")[0].addEventListener("click", function(e) {self.view(e); }, false);
                    tmp.getElementsByClassName("removebtn")[0].addEventListener("click", function(e) {self.remove(e); }, false);
                    document.body.appendChild(tmp);
                    console.log("trying to update the badge.");
                    notableapp.updateBadgeText("0");
                }
            }, function(tx, error){
                alert('Failed to retrieve notes from database - ' + error.message);
                return;
            });
        });
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
    var cap = new Capture();
    chrome.tabs.getSelected(null, function(tab) {
        cap.url = tab.url;
        cap.title = tab.title;
    });
    chrome.tabs.captureVisibleTab(null, function(img) {
        cap.image = img;
    });
    
    // enforcing a delay. SQLite seems to be sloooow!
    window.setTimeout(function(){
        cap.display();
        cap.save();
//        cap.log();
    }, 300);
}

var notableapp = (function () {
	return {
		init : function () {
			var result;
			try {
			    db = openDatabase("NotableAppDB", "1.0", "NotableApp Captures Table", 20000);
			    db.transaction (function(tx) {
			        tx.executeSql ("SELECT id FROM NotableApp", [], function(tx, result) { 
			            console.log("records count is " + result.rows.length);
			        },
			        function(tx, error) {
			            tx.executeSql("CREATE TABLE IF NOT EXISTS NotableApp (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, title TEXT, url TEXT, image BLOB)", [], 
			    			function(r) {
			    				console.log("table successfully created. ");
			    			});
			    		}
			       );
			    });
			} catch (err) {
			    console.log("failed to open the db.");
			}
			return db;
		},
		totalCaptures : function () {
			console.log("fetching the total number of captures.");
			return 1;
		},
		updateBadgeText : function (count) {
			console.log("updating the badge-text.");
			chrome.browserAction.setBadgeText({
				text: count
			});
		}
	}
})();
