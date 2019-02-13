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

function playChord(quality, inversion = 0){
	var notes = MusicTheory.getChord(48, quality, inversion);
	console.log(notes);
	for(var i = 0; i < notes.length; i++){
		MIDI.noteOn(0, notes[i], 127, 0);
		MIDI.noteOff(0, notes[i], 3);
	}
}