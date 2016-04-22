// semi-colon to avoid issues with unclosed code from other scripts during concatenation
;
(function($, window, document, undefined) {

	"use strict";

	// as `undefined` is actually mutable in old browsers, use 'undefined' as a function
	// parameter and pass no value to make sure it is truly undefined

	// passing `window` and `document` as function parameters makes references to them
	// minifyable and accessing them slightly more performant


	var pluginName = "defaultPluginName",
		defaults = {
			foo: "bar",
			baz: {
				canBe: "nested too"
			}
		};


	var setup = function(options, $element) {

		var Plugin = function() {
			this.options = options;
			this.$element = $element;
			this.destroy = pluginLogic.destroy;

			this.init();
		};

		$.extend(Plugin.prototype, pluginLogic);

		var instance = new Plugin;
		return instance;
	};

	var pluginLogic = {

		get settings() {
			delete this.settings; // go cache yourself
			return this.settings = $.extend(true, {}, defaults, this.options);
		},

		destroy: function() {
			// console.log("destroyed", this.$element);
			return this.$element.off("." + pluginName); // return to be chainable
			// remove all event handlers delegated to $element under the".`pluginName`"
			// namespace
			// See api.jquery.com/off/#example-4
		},


		//
		// Some example logic
		//

		$body: $("body"),

		init: function() {
			this.bar();

			this.$element.on("click." + pluginName, function() {
				$(this).text("Clicked", Math.random())
			});

			var proto = this; // access `pluginLogic` in function contexts

			this.$body.on("click." + pluginName, function() {
				//`this` is now the body node, use proto to reference the prototype object
				proto.someMethod($(this));
			});
		},

		someMethod: function($el) {
			$el.append("<div>Clicked (" +
				this.$element[0].tagName + ", " +
				"settings: " + JSON.stringify(this.settings) +
				")</div>");
		},

		bar: function() {
			this.$element.append('[ assigned to $.fn.' + pluginName + '() ]');
		}
	};


	//
	// Register plugin
	//

	// $.pluginName
	$[pluginName] = setup;
	// $[pluginName] = function(options) {
	// 	setup(options)
	// };

	// $().pluginName
	$.fn[pluginName] = function(options) {
		return this.each(function() { // TODO: test if calling destroy directly works

			if ($(this).data("plugin_" + pluginName)) {
				// If plugin has already been instantiated with this element.
				// You could do nothing or destroy the old instancee and make a new one.
				// You probably don't want to have multiple instances on the same element
				// though.
				// $(this).data("plugin_pluginName").destroy();
				return;
			}

			$(this).data("plugin_" + pluginName, setup(options, $(this)));

			/*
			plugin can be destroyed later on specific elements by doing
			$elements.data("plugin_pluginName").destroy();
			or
			$("*").filter(function() {
				return $(this).data("plugin_defaultPluginName") !== undefined
			}).each(function() {
				$(this).data("plugin_defaultPluginName").destroy()
			});
			*/
		});
	};

})(jQuery, window, document);
