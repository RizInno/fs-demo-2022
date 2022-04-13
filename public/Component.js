sap.ui.define([
	"sap/ui/core/UIComponent"
], function(UIComponent) {
	"use strict";

	return UIComponent.extend("com.demo.websocket.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and
		 * calls the init method once. In this function, the device models are set and the router
		 * is initialized.
		 *
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// Chat Model
			var oModel = this.getModel("chatModel");
			var aNames = ["Student1", "Student2", "Student3", "Student4", "Student5", "Student6"];
			oModel.setData({
				user: aNames[Math.floor(aNames.length * Math.random())],
				chat: "",
				message: ""
			});
		},

		destroy: function() {
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		}

	});

});