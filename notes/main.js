/**
 * @author chaitanya
 */
var sync_count = 0;
var syncTimeout = 1000 * 2; // 1 second.

function main() {
	var notes = localStorage["notes"];
	var notesDIV = document.getElementById("notes_area");
	notesDIV.value = notes;
}

function save_notes() {
	sync_count += 1;
	var notesDIV = document.getElementById("notes_area");
	var notes = notesDIV.value;
	localStorage["notes"] = notes;

	var syncStatusDIV = document.getElementById("savedbtn");
	syncStatusDIV.innerHTML = "save : " + sync_count;
}

function sync_note_online() {
}

function hideSyncStatus() {
	var syncStatusDIV = document.getElementById("saved_status");
	// syncStatusDIV.innerHTML = "not synced!";
	syncStatusDIV.style.display = none;
}

function container_notes() {
	var settings = document.getElementById("settings");
    settings.style.display = "none";

    var container = document.getElementById("container");
    container.style.display = "block";	
}

function settings_notes() {
	var settings = document.getElementById("settings");
    settings.style.display = "block";

    var container = document.getElementById("container");
    container.style.display = "none";
}

window.addEventListener("load", function(e) {
	var settingsbtn = document.getElementById("settingsbtn");
	settingsbtn.addEventListener("click", settings_notes, false);

	var backbtn = document.getElementById("backbtn");
	backbtn.addEventListener("click", container_notes, false);
}, false);
