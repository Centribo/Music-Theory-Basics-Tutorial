class PianoKeyboard {
	constructor(pianoHTML = document.getElementById("pianoKeyboard"), startingNoteNumber = 48, range = 25){
		//Color/styling
		this.highlightedKeyColor = "#ffaa00";
		this.pressedKeyColor = "#ff0000";
		this.whiteKeyColor = "#cbcbcb";
		this.whiteKeyBorderColor = "#aaaaaa";
		this.blackKeyColor = "#222222";
		this.blackKeyBorderColor = "#000000";

		//Tracking variables
		this.startingNoteNumber = startingNoteNumber;
		this.endingNoteNumber = startingNoteNumber + range - 1;
		this.keys = {}; //Dictionary
		this.isMouseDown = false;
		this.pianoHTML = pianoHTML;

		//Callbacks
		this.onKeyPress;
		this.onKeyRelease;

		//Start construction of HTML keyboard:
		var whiteKeyCount = 0;
		for(var i = this.startingNoteNumber; i <= this.endingNoteNumber; i++){
			this.keys[i] = PianoKeyboard.getNoteHTML(i);
			pianoHTML.appendChild(this.keys[i]);
			//Add event listeners for mouse input
			this.keys[i].addEventListener("mousedown", this.notePressed.bind(this));
			this.keys[i].addEventListener("mouseup", this.noteReleased.bind(this));
			this.keys[i].addEventListener("mouseenter", this.noteEnter.bind(this));
			this.keys[i].addEventListener("mouseleave", this.noteExit.bind(this));
		}

		//Determine if right-most note is a white key
		var lastNote = MIDINotes.MIDIToNoteName(this.endingNoteNumber).noteName;
		var lastNoteIsWhite = false;
		if(lastNote == "A" ||
			lastNote == "B" ||
			lastNote == "C" ||
			lastNote == "D" ||
			lastNote == "E" ||
			lastNote == "F" ||
			lastNote == "G"){
			
			lastNoteIsWhite = true;
		}
		//Get HTML DOM elements for white and black keys
		var whiteKeys = pianoHTML.getElementsByClassName("white-key");
		var blackKeys = pianoHTML.getElementsByClassName("black-key");

		//Calculate sizes and offets
		var units = "vw";
		var pianoWidth = 80;
		var pianoHeight = pianoWidth * 0.18;
		var borderWidth = pianoWidth * 0.0015;
		var whiteKeyWidth = pianoWidth/whiteKeys.length;
		var whiteKeyHeight = pianoHeight;
		var blackKeyWidth = whiteKeyWidth * 0.55;
		var blackKeyHeight = whiteKeyHeight * 0.55;
		var blackKeyOffset = (-(blackKeyWidth/2) - borderWidth);

		//Assign CSS to each key
		for(var i = 0; i < whiteKeys.length; i++){
			whiteKeys[i].style.cssText =
			"float: left;" +
			"position: relative;" +
			"z-index: 1;" +
			"height: " + whiteKeyHeight + units + ";" +
			"width: " + whiteKeyWidth + units + ";" +
			"border-top: " + borderWidth + units + " solid " + this.whiteKeyBorderColor + ";" +
			"border-bottom: " + borderWidth + units + " solid " + this.whiteKeyBorderColor + ";" +
			"border-left: " + borderWidth + units + " solid " + this.whiteKeyBorderColor + ";" +
			"background-color: " + this.whiteKeyColor + ";";
			if(whiteKeys[i].classList.contains("A") ||
				whiteKeys[i].classList.contains("B") ||
				whiteKeys[i].classList.contains("D") ||
				whiteKeys[i].classList.contains("E") ||
				whiteKeys[i].classList.contains("G")){

				whiteKeys[i].style.cssText += "margin: 0 0 0 " + blackKeyOffset + units + ";";
			}

			//Special case for right border of last key (if it's a white key only)
			if(lastNoteIsWhite && i == whiteKeys.length-1){
				whiteKeys[i].style.cssText += "border-right: " + borderWidth + units + " solid " + this.whiteKeyBorderColor + ";"; 
			}
		}
		for(var i = 0; i < blackKeys.length; i++){
			blackKeys[i].style.cssText =
			"float: left;" +
			"position: relative;" +
			"z-index: 2;" +
			"margin: 0 0 0 " + blackKeyOffset + units + ";" +
			"height: " + blackKeyHeight + units + ";" +
			"width: " + blackKeyWidth + units + ";" +
			"border: " + borderWidth + units + " solid " + this.blackKeyBorderColor + ";" +
			"background-color: " + this.blackKeyColor + ";";
		}

		this.isActive = true; //This piano-keyboard is active now
	} //End constructor

	destroy(){
		while (this.pianoHTML.firstChild) {
			this.pianoHTML.removeChild(this.pianoHTML.firstChild);
		}
		this.isActive = false; //This piano-keyboard is no longer active
	}

	//"pressed", "released", "highlighted", "custom"
	changeKeyColor(noteNumber, state = "pressed", color = "#000000"){
		var key = this.keys[noteNumber];
		if(key != null){
			if(state == "pressed"){
				key.style.backgroundColor = this.pressedKeyColor;
			} else if(state == "released"){
				if(key.classList.contains("white-key")){
					key.style.backgroundColor = this.whiteKeyColor;
				} else {
					key.style.backgroundColor = this.blackKeyColor;
				}
			} else if(state == "highlighted"){
				key.style.backgroundColor = this.highlightedKeyColor;
			} else if(state == "custom"){
				key.style.backgroundColor = color;
			} else {
				console.error("changeKeyColor :: state is invalid");
			}
		} else {
			console.error("changeKeyColor :: key not found");
		}
	}

	notePressed(event){
		event.target.style.backgroundColor = this.pressedKeyColor;
		this.isMouseDown = true;
		if(typeof this.onKeyPress == 'function'){
			this.onKeyPress(event.target.dataset.note);
		}
	}
	
	noteReleased(event){
		if(event.target.classList.contains("white-key")){
			event.target.style.backgroundColor = this.whiteKeyColor;
		} else {
			event.target.style.backgroundColor = this.blackKeyColor;
		}
		this.isMouseDown = false;

		if(typeof this.onKeyRelease == 'function'){
			this.onKeyRelease(event.target.dataset.note);
		}
	}
	
	noteEnter(event){
		if(this.isMouseDown){
			event.target.style.backgroundColor = this.pressedKeyColor;
			if(typeof this.onKeyPress == 'function'){
				this.onKeyPress(event.target.dataset.note);
			}
		}
	}
	
	noteExit(event){
		if(this.isMouseDown){
			if(event.target.classList.contains("white-key")){
				event.target.style.backgroundColor = this.whiteKeyColor;
			} else {
				event.target.style.backgroundColor = this.blackKeyColor;
			}

			if(typeof this.onKeyRelease == 'function'){
				this.onKeyRelease(event.target.dataset.note);
			}
		}
	}

	static getNoteHTML(noteNumber){
		var noteName = MIDINotes.MIDIToNoteName(noteNumber).noteName;
		var octave = MIDINotes.MIDIToNoteName(noteNumber).octave;
		var div = document.createElement("div");
		
		div.classList.add("key");
		div.classList.add(noteName);
		div.dataset.note = noteNumber;

		if(noteName == "C" ||
			noteName == "D" ||
			noteName == "E" ||
			noteName == "F" ||
			noteName == "G" ||
			noteName == "A" ||
			noteName == "B"){
			div.classList.add("white-key");
		} else {
			div.classList.add("black-key");
		}

		return div;
	}
}