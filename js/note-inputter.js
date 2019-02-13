var notes = ["A", "B", "C", "D", "E", "F", "G"];
var accidentals = ["b", "", "#"];

class NoteInputter {
	constructor(inputterHTML = document.getElementById("note-inputter"), octave = 4){
		
		//Tracking variables
		this.octave = octave;
		this.keys = {}; //Dictionary

		//Callbacks
		this.onNoteClick;

		for(var j = 1; j >= -1; j--){
			for(var i = 0; i < notes.length; i++){
				this.keys[notes[i] + accidentals[j+1]] = NoteInputter.getNoteHTML(notes[i], j);
				inputterHTML.appendChild(this.keys[notes[i] + accidentals[j+1]]);
				this.keys[notes[i] + accidentals[j+1]].addEventListener("click", this.noteClicked.bind(this));
			}
		}

		// console.log(this.keys);
	}

	addClassToNote(noteName, className){
		this.keys[noteName].classList.add(className);
	}

	removeClassFromNote(noteName, className){
		this.keys[noteName].classList.remove(className);
	}

	noteClicked(event){
		if(typeof this.onNoteClick == 'function'){
			this.onNoteClick({
				noteName: event.target.dataset.note + event.target.dataset.accidental,
				noteNumber: event.target.dataset.noteNumber
			});
		}
	}
	
	static getNoteHTML(note, accidental = 0, octave = 4){
		note = note.toUpperCase();
		var accidentalSymbol = "";
		var accidentalClass = "natural";
		if(accidental < 0){
			accidentalSymbol = "b";
			accidentalClass = "flat";
		} else if(accidental > 0){
			accidentalSymbol = "#";
			accidentalClass = "sharp";	
		}

		var noteNumber = MIDINotes.noteNameToMIDI(note + accidentalSymbol, octave);
		var button = document.createElement("button");
		var text = document.createTextNode(note + accidentalSymbol);
		button.appendChild(text);
		button.classList.add("note-inputter-button");
		button.classList.add("note-inputter-" + accidentalClass);
		button.dataset.note = note;
		button.dataset.accidental = accidentalSymbol;
		button.dataset.noteNumber = noteNumber;

		button.classList.add("waves-effect", "waves-light", "btn"); //Materialize CSS

		return button;
	}
}