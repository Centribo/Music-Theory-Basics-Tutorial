var piano;
var noteInputter;
var isMIDIJsLoaded = false;
var instrumentName = "acoustic_grand_piano";

window.onload = function () {
	MIDI.loadPlugin({
		soundfontUrl: "./soundfont/",
		instrument: instrumentName,
		onprogress: function(state, progress) {
			console.log(state, progress);
		},
		onsuccess: function() {
			MIDI.programChange(0, MIDI.GM.byName[instrumentName].number);
			isMIDIJsLoaded = true;
		}
	});
};

//Returns random int in the given range (inclusive)
function getRandomInt(min = 0, max = 1){
	return Math.floor(Math.random() * (max-min+1)) + min;
}

function playMIDINote(note, velocity){
	if(isMIDIJsLoaded){
		MIDI.noteOn(0, note, velocity, 0);
	}
}

function stopMIDINote(note, velocity){
	if(isMIDIJsLoaded){
		MIDI.noteOff(0, note, 0);
	}
}

function previewInterval(a, b){
	if(isMIDIJsLoaded){
		MIDI.noteOn(0, a, 127, 0);
		MIDI.noteOn(0, b, 127, 2);
		MIDI.noteOn(0, a, 127, 4);
		MIDI.noteOn(0, b, 127, 4);

		MIDI.noteOff(0, a, 6);
		MIDI.noteOff(0, b, 6);
	}
}

function previewChord(root, quality, inversion = 0){
	var notes = MusicTheory.getChord(root, quality, inversion);
	// Play individually
	for (var i = 0; i < notes.length; i++){
		MIDI.noteOn(0, notes[i], 127, i);
		MIDI.noteOff(0, notes[i], 3);
	}

	// Play all at once:
	for(var i = 0; i < notes.length; i++){
		MIDI.noteOn(0, notes[i], 127, notes.length);
		MIDI.noteOff(0, notes[i], notes.length+2);
	}
}

function previewScale(root, quality){
	var notes = [];

	switch(quality){
		case "Major":
			notes = [root, root + 2, root + 4, root + 5, root + 7, root + 9, root + 11, root + 12,
					root + 12, root + 11, root + 9, root + 7, root + 5, root + 4, root + 2, root];
		break;
		case "Natural Minor":
			notes = [root, root + 2, root + 3, root + 5, root + 7, root + 8, root + 10, root + 12,
					root + 12, root + 10, root + 8, root + 7, root + 5, root + 3, root + 2, root];
		break;
	}

	for(var i = 0; i < notes.length; i++){
		MIDI.noteOn(0, notes[i], 127, i);
		MIDI.noteOff(0, notes[i], 127, i+1.5);
	}
}

function playChord(root, quality, inversion = 0){
	var notes = MusicTheory.getChord(root, quality, inversion);
	console.log(notes);
	for(var i = 0; i < notes.length; i++){
		MIDI.noteOn(0, notes[i], 127, 0);
		MIDI.noteOff(0, notes[i], 1);
	}
}