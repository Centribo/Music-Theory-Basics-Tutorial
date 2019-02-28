//Way of connecting and dynamically generating ABC notation, then using ABCJS to render it.

//A "musical element" in the context of this file is a note, notes, chord, chords, rest, rests, etc.

//Main functionality:
//"Setting" a musical element adds to the notes to be rendered
//"Rendering" will render all the musical elements that have been currently set
//"Immediately Rendering" a musical element will clear any set notes and render the passed in elements immediately

var referenceNumber = 1;
var title = "Notes";
var meter = "4/4";
var noteLength = "1/4";
var tempo = "120";
var key = "C";
var musicalElements = "";
var notationID = "notation";

//Construct all the information to be rendered into a single ABC notation string and return it
function constructABCString(){
	var output = 
	"X:" + referenceNumber + "\n" +
	"T:" + title + "\n" +
	"M:" + meter + "\n" +
	"L:" + noteLength + "\n" +
	// "Q:" + tempo + "\n" +
	"K:" + key + "\n" +
	musicalElements + " |]";

	return output;
}

//Clears off all currently displayed musical elements
function clearNotes(){
	musicalElements = "";
	var abc = constructABCString();
	ABCJS.renderAbc(notationID, abc);
}

//Removes all notation
function clearNotation(){
	ABCJS.renderAbc(notationID, "");
}

//Render all set musical elements currently set
function renderNotation(){
	var abc = constructABCString();
	ABCJS.renderAbc(notationID, abc);
}

//Set a given ABC note
function setABCNote(note, duration = ""){
	musicalElements += note + duration + " ";
}

//Set a given MIDI note
function setMIDINote(MIDINumber, duration = ""){
	setABCNote(MIDINotes.MIDINoteToABCNote(MIDINumber), duration);
}

//Set the chord corresponding to the given a list of MIDI note numbers
function setMIDIChord(MIDINumbers, duration = ""){
	musicalElements += "["
	for(var i = 0; i < MIDINumbers.length; i++){
		musicalElements += MIDINotes.MIDINoteToABCNote(MIDINumbers[i]) + duration + " ";
	}
	musicalElements += "] ";
}

//Sets a rest of given length
function setRest(duration = ""){
	musicalElements += "z" + duration + " ";
}

//Sets a bar line
function setBarLine(){
	musicalElements += "| ";
}

//Sets a new line
function setNewLine(){
	musicalElements += "\n";
}

//Immediately renders a given MIDI note
function immediateRenderNote(MIDINumber, duration = ""){
	musicalElements = MIDINotes.MIDINoteToABCNote(MIDINumber) + duration + " ";
	renderNotation();
}

//Immediately renders a rest
function immediateRenderRest(duration = ""){
	musicalElements = "z" + duration;
	renderNotation();
}

//Immediately renders a chord represented by the given MIDI notes
function immediateRenderChord(MIDINumbers, duration = ""){
	musicalElements = "[";
	for(var i = 0; i < MIDINumbers.length; i++){
		musicalElements += MIDINotes.MIDINoteToABCNote(MIDINumbers[i]) + duration + " ";
	}
	musicalElements += "]";
	
	renderNotation();
}