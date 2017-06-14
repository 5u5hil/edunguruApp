// To use this, import the Fullscreen class, instantiate it and call implementHtml5FullscreenApi().

import remote from 'remote';

export default class Fullscreen {
	constructor() {
		this.browserWindow = remote.getCurrentWindow();
		this.elementPrototype = Element.prototype;

		this._fullscreenElement = null;
	}

	implementHtml5FullscreenApi() {
		var controller = this;
		this._assignAllTo(
			[this.elementPrototype, document],
			['requestFullscreen', 'webkitRequestFullscreen', 'webkitRequestFullScreen'],
			function() {
				controller._fullscreenElement = this;
				controller.browserWindow.setFullScreen(true);
			}
		);

		this._assignAllTo(
			[this.elementPrototype, document],
			['exitFullscreen', 'webkitExitFullscreen', 'webkitCancelFullScreen'],
			() => {
				this.browserWindow.setFullScreen(false);
			}
		);

		this._defineAll(
			[this.elementPrototype, document],
			['fullscreenEnabled', 'webkitFullscreenEnabled', 'webkitIsFullScreen'],
			{get: () => this.browserWindow.isFullScreen()}
		);

		this._defineAll(
			[this.elementPrototype, document],
			['fullscreenElement', 'webkitFullscreenElement', 'webkitCurrentFullScreenElement'],
			{get: () => this._fullscreenElement}
		);

		let triggerFullscreenChange = () => {
			let eventOptions = {bubbles: true, cancelable: false};

			document.dispatchEvent(new Event('fullscreenchange', eventOptions));
			document.dispatchEvent(new Event('webkitfullscreenchange', eventOptions));
		};

		this.browserWindow.on('enter-full-screen', () => {
			triggerFullscreenChange();
		});

		this.browserWindow.on('leave-full-screen', () => {
			triggerFullscreenChange();
			this._fullscreenElement = null;
		});
	}

	_assignAllTo(objects, properties, value) {
		this._forEveryObjectForEachProperty(objects, properties,
			(object, property) => object[property] = value);
	}

	_defineAll(objects, properties, definition) {
		this._forEveryObjectForEachProperty(objects, properties,
			(object, property) => Object.defineProperty(object, property, definition));
	}

	_forEveryObjectForEachProperty(objects, properties, iterator) {
		objects.forEach(object => {
			properties.forEach(property => {
				iterator(object, property);
			});
		});
	}
}

