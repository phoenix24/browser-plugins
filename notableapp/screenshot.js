// Listen for a click on the camera icon. On that click, take a screenshot.
chrome.browserAction.onClicked.addListener(function(tab) {	
	chrome.tabs.captureVisibleTab(null, function(img) {
		var screenshotUrl = img;
		var localStorage["scr1"] = img;
	});
});
//			 var viewTabUrl = chrome.extension.getURL('screenshot.html');
//			
//			 chrome.tabs.create( {
//			 url : viewTabUrl
//			 }, function(tab) {
//			 var targetId = tab.id;
//			
//			 var addSnapshotImageToTab = function(tabId, changedProps) {
//			 // We are waiting for the tab we opened to finish loading.
//			 // Check that the the tab's id matches the tab we opened,
//			 // and that the tab is done loading.
//			 if (tabId != targetId || changedProps.status != "complete")
//			 return;
//			
//			 // Passing the above test means this is the event we were
//			 // waiting for.
//			 // There is nothing we need to do for future onUpdated events,
//			 // so we
//			 // use removeListner to stop geting called when onUpdated events
//			 // fire.
//			 chrome.tabs.onUpdated.removeListener(addSnapshotImageToTab);
//			
//			 // Look through all views to find the window which will display
//			 // the screenshot.
//			 var views = chrome.extension.getViews();	
//			 for ( var i = 0; i < views.length; i++) {
//			 var view = views[i];
//			 // If more than one screen shot tab is opened, we need to
//			 // ensure that we do not change an existing screen shot image.
//			 // view.imageAlreadySet is set to true when an image is set
//			 // for the first time. We never change an image in a window with
//			 // this flag set.
//			 if (view.location.href == viewTabUrl && !view.imageAlreadySet) {
//			 view.setScreenshotUrl(screenshotUrl);
//			 view.imageAlreadySet = true;
//			 break;
//			 }
//			 }
//			 };
//			 chrome.tabs.onUpdated.addListener(addSnapshotImageToTab);
//		});
//});
