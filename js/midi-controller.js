class MIDIControllers {
	static loadMIDIDevices(){
		if (navigator.requestMIDIAccess) {
			console.info("Browser supports MIDI!");
			return navigator.requestMIDIAccess().then(MIDILoadSuccess, MIDILoadFailure); //Promises
		} else {
			console.error("Browser does not support MIDI!");
			return -1;
		}
	}

	static getMIDIControllers(){
		return midiControllers;
	}
}

var midiControllers = {}; //Dictionary/Associative array of MIDIControllers

function MIDILoadSuccess(midi) {
	if(midi.inputs.size < 1){
		console.info("No MIDI input devices found!");
		return -1;
	}
	
	//Iterate through devices and attach midiControllers to them
	var inputs = midi.inputs.values();
	for (var input = inputs.next(); input && !input.done; input = inputs.next()){
		var c = new MIDIController(input.value.name, input.value.manufacturer, input.value.id);
		input.value.onmidimessage = onMIDIMessage; //Bind event handler
		midiControllers[input.value.id] = c;
	}

	return 0;
}

function onMIDIMessage(message) {
	//Call correct event handler for MIDI controller
	midiControllers[message.target.id].onMIDIMessage(message);
}

function MIDILoadFailure() {
	console.error("No access to your midi devices.");
}

class MIDIController {
	constructor(device, manufacturer, id = 0){
		this.device = device;
		this.manufacturer = manufacturer;
		this.currentlyOnNotes = [];
		this.id = id;
	
		//Callbacks
		this.onKeyPress;
		this.onKeyRelease;
	}
	

	onMIDIMessage (message) {
		//message.data[0] == event type
			//144 = noteOn, 128 = noteOff
		//message.data[1] == event key
		//message.data[2] == key velocity

		//Add or remove note from currentlyOnNotes array
		if(message.data[0] == 144){
			if(this.currentlyOnNotes.indexOf(message.data[1]) == -1){
				this.currentlyOnNotes.push(message.data[1]);
			}
			if(typeof this.onKeyPress == 'function'){
				this.onKeyPress(this, message.data[1], message.data[2]);
			}
		} else if(message.data[0] == 128){
			var index = this.currentlyOnNotes.indexOf(message.data[1]);
			if(index > -1){
				this.currentlyOnNotes.splice(index, 1);
			}
			if(typeof this.onKeyRelease == 'function'){
				this.onKeyRelease(this, message.data[1], message.data[2]);
			}
		}
		
		// console.info(this.device, this.currentlyOnNotes);
	}
}