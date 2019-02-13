class Settings {
	static init(){
		this.inputDevicesSelectorElement = document.getElementById("input-devices-selector");
		this.inputDevicesSelectorInstance = M.FormSelect.getInstance(this.inputDevicesSelectorElement);
		this.inputDevicesSelectorElement.addEventListener("change", this.deviceSelected.bind(this));
		this.MIDIDeviceID = null;
	}

	static deviceSelected(){
		this.MIDIDeviceID = this.inputDevicesSelectorElement.value;
		console.log(this.MIDIDeviceID);
		if(this.MIDIDeviceID == null){
			return;
		}
		
	}

	static clearInputDevicesList(){
		while (this.inputDevicesSelectorElement.firstChild) {
			this.inputDevicesSelectorElement.removeChild(this.inputDevicesSelectorElement.firstChild);
		}
	}

	static addInputDeviceToList(device){
		var node = document.createElement("option");
		node.value = device.id;
		var textNode = document.createTextNode(device.device);
		node.appendChild(textNode);
		this.inputDevicesSelectorElement.appendChild(node);
	}

	static refreshInputDevicesList(){
		M.FormSelect.init(this.inputDevicesSelectorElement, null);
	}

	static updateInputDevicesList(){
		Settings.clearInputDevicesList();
		var devices;
		MIDIControllers.loadMIDIDevices().then(function(){
			devices = MIDIControllers.getMIDIControllers();
			if(!isEmpty(devices)){
				//There are MIDI devices
				var inputDevices = [];
				for(var key in devices){
					Settings.addInputDeviceToList(devices[key]);
				}
				Settings.refreshInputDevicesList();
			} else {
				//There are no MIDI devices
				var node = document.createElement("option");
				node.value = null;
				node.disabled = true;
				node.selected = true;
				var textNode = document.createTextNode("No MIDI devices found");
				node.appendChild(textNode);
				Settings.inputDevicesSelectorElement.appendChild(node);
				Settings.refreshInputDevicesList();
				Settings.deviceSelected();
			}
		});
	}
}
