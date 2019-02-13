// Class for help with music theory
// All data uses MIDI note standard
class MusicTheory {
	static getInterval(intervalName){
		var semitones = this.intervals[intervalName];
		if(semitones == null) {
			return 0;
		}
		return semitones;
	}

	static getChord(root, chordName, inversion = 0){
		var notes = [].concat(this.chords[chordName].values); //Make sure to copy the array (or else we're getting a reference)
		if(notes == null) {
			return null;
		}

		for(var i = 0; i < notes.length; i++){
			notes[i] = root + this.getInterval(notes[i]);
		}
		
		for(var i = 0; i < inversion; i++){
			notes[i%notes.length] = notes[i%notes.length] + 12;
		}
		return notes;
	}
}

// Dictionary to look up intervals by name
// Adapted from https://en.wikipedia.org/wiki/Interval_(music)
MusicTheory.intervals = {
	"HS": 1,   //Half-step
	"WS": 2,   //Whole-step
	"S" : 1,   // Semitone
	"T" : 2,   // Tone
	"TT": 6,   // Tritone

	"P1": 0,    // Perfect unison
	"m2": 1,    // Minor second
	"M2": 2,    // Major second
	"m3": 3,    // Minor third
	"M3": 4,    // Major third
	"P4": 5,    // Perfect fourth
	"P5": 7,    // Perfect fifth
	"m6": 8,    // Minor sixth
	"M6": 9,    // Major sixth
	"m7": 10,   // Minor seventh
	"M7": 11,   // Major seventh
	"P8": 12,   // Perfect octave

	"d2": 0,    // Diminished second
	"A1": 1,    // Augmented unison
	"d3": 2,    // Diminished third
	"A2": 3,    // Augmented second
	"d4": 4,    // Diminished fourth
	"A3": 5,    // Augmented third
	"d5": 6,    // Diminished fifth
	"A4": 6,    // Augmented fourth
	"d6": 7,    // Diminished sixth
	"A5": 8,    // Augmented fifth
	"d7": 9,    // Diminished seventh
	"A6": 10,   // Augmented sixth
	"d8": 11,   // Diminished octave
	"A7": 12    // Augmented seventh
};

//Dictionary to look up chords by name
MusicTheory.chords = {
	//Triads:
	"Major triad"     : { values: ["P1", "M3", "P5"] },
	"Minor triad"     : { values: ["P1", "m3", "P5"] },
	"Diminished triad": { values: ["P1", "m3", "d5"] },
	"Augmented triad" : { values: ["P1", "M3", "A5"] },

	//Sevenths:
	"Major seventh"     : { values: ["P1", "M3", "P5", "M7"] },
	"Minor seventh"     : { values: ["P1", "m3", "P5", "m7"] },
	"Minor major"       : { values: ["P1", "m3", "P5", "M7"] },
	"Dominant seventh"  : { values: ["P1", "M3", "P5", "m7"] },
	"Half-diminished"   : { values: ["P1", "m3", "d5", "m7"] },
	"Diminished seventh": { values: ["P1", "m3", "d5", "d7"] },
	"Augmented major"   : { values: ["P1", "M3", "A5", "M7"] }
}
//Setup aliases:
MusicTheory.chords["Major"] = MusicTheory.chords["Major triad"];
MusicTheory.chords["maj"]   = MusicTheory.chords["Major triad"];

MusicTheory.chords["Minor"]      = MusicTheory.chords["Minor triad"];
MusicTheory.chords["Diminished"] = MusicTheory.chords["Diminished triad"];
MusicTheory.chords["Augmented"]  = MusicTheory.chords["Augmented triad"];

MusicTheory.chords["Major minor"] = MusicTheory.chords["Minor major"];
MusicTheory.chords["majmin"]      = MusicTheory.chords["Minor major"];
MusicTheory.chords["minmaj"]      = MusicTheory.chords["Minor major"];
