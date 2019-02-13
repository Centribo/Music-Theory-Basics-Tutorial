class MIDINotes {
	//Helper functions for MIDI:
	
	//MIDI note to tuple: (nametype = 0, 1, 2 3 for regular, flipped, flats only, sharps only
	//[Note number relative to C, Octave, name of note]
	static MIDIToNoteName(MIDINumber, nameType = 0){
		var noteNumber = MIDINumber%12; //Note number in semitones/halfsteps relative to C
		var noteName = this.noteNames[noteNumber]; //Mapped note name
		switch(nameType){
			case 1:
			noteName = this.flippedNoteNames[noteNumber];
			break;
			case 2:
			noteName = this.onlyFlatsNoteNames[noteNumber];
			break;
			case 3:
			noteName = this.onlySharpsNoteNames[noteNumber];
			break;
		}
		var octave = Math.floor(MIDINumber/12)-1;
		return {
			noteName: noteName,
			noteNumber: noteNumber,
			octave: octave
		};
	}
	
	//Return frequency of note as defined by MIDI standard
	static MIDIToNoteFrequency(MIDINumber){
		return Math.pow(2, ((MIDINumber - 69) / 12)) * 440;
	}
	
	//Lookup name to note number
	//Return 0, 1, ..., 11 depending on what note name given
	//Return -1 if note does not exist
	static noteNameToNoteNumber(noteName){
		switch(noteName){
			case "B#":
			noteName = "C";
			break;
			case "Cb":
			noteName = "B";
			break;
			case "E#":
			noteName = "F";
			break;
			case "Fb":
			noteName = "E";
			break;
		}

		var lookupResults = [
			this.noteNames.indexOf(noteName),
			this.flippedNoteNames.indexOf(noteName),
			this.onlyFlatsNoteNames.indexOf(noteName),
			this.onlySharpsNoteNames.indexOf(noteName)
		];
		
		for(var i = 0; i < lookupResults.length; i++){
			if(lookupResults[i] != -1){
				return lookupResults[i];
			}
		}
		
		return -1;
	}
	
	//Convert given note number and octave to MIDI note number
	static noteNumberToMIDI(noteNumber, octave = 4){
		if(noteNumber < 0 || octave < 0){
			return -1;
		}
		
		return (60 + noteNumber) + ((octave - 4)*12);
	}
	
	//Convert given note name and octave to MIDI note number
	static noteNameToMIDI(noteName, octave = 4){
		var noteNumber = this.noteNameToNoteNumber(noteName);
		return this.noteNumberToMIDI(noteNumber, octave);
	}
	
	//Returns true if two given MIDI notes have the same name
	//Returns false otherwise
	static isSameNoteName(noteA, noteB){
		return ((noteA - noteB) % 12) == 0;
	}
	
	//Converts a MIDI note number to the corrresponding ABC notation note name (In the key of C)
	static MIDINoteToABCNote(note, sharpsOnly = true){
		var midiNote = this.MIDIToNoteName(note);
		var output = "";
		switch(midiNote.noteNumber){
			case 0: //C
			output = "C";
			break;
			case 1: //C#/Db
			if(sharpsOnly){
				output = "^C";
			} else {
				output = "_D";
			}
			break;
			case 2: //D
			output = "D";
			break;

			case 3: //Eb/D#
			if(sharpsOnly){
				output = "^D";
			} else {
				output = "_E";
			}
			break;
			case 4: //E
			output = "E";
			break;
			case 5: //F
			output = "F";
			break;
			case 6: //F#/Gb
			if(sharpsOnly){
				output = "^F";
			} else {
				output = "_G";
			}
			break;
			case 7: //G
			output = "G";
			break;
			case 8: //Ab/G#
			if(sharpsOnly){
				output = "^G";
			} else {
				output = "_A";
			}
			break;
			case 9: //A
			output = "A";
			break;
			case 10: //Bb/A#
			if(sharpsOnly){
				output = "^A";
			} else {
				output = "_B";
			}
			break;
			case 11: //B
			output = "B";
			break;
		}

		switch(midiNote.octave){
			case 3:
			output += ",";
			break;
			case 5:
			output = output.toLowerCase();
			break;
			case 6:
			output = output.toLowerCase();
			output += ",";
			break;
		}

		return output;
	}
}

//Cover all the ways someone could name a note in the chromatic scale
//                          0    1        2    3        4    5    6        7    8        9    10       11
MIDINotes.noteNames =           ["C", "C#/Db", "D", "Eb/D#", "E", "F", "F#/Gb", "G", "Ab/G#", "A", "Bb/A#", "B"];
MIDINotes.flippedNoteNames =    ["C", "Db/C#", "D", "D#/Eb", "E", "F", "Gb/F#", "G", "G#/Ab", "A", "A#/Bb", "B"];
MIDINotes.onlyFlatsNoteNames =  ["C", "Db",    "D", "Eb",    "E", "F", "Gb",    "G", "Ab",    "A", "Bb",    "B"];
MIDINotes.onlySharpsNoteNames = ["C", "C#",    "D", "D#",    "E", "F", "F#",    "G", "G#",    "A", "A#",    "B"];
