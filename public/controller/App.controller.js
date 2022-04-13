sap.ui.define([
	"./BaseController",
	"sap/ui/core/ws/WebSocket",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function(BaseController, WebSocket, MessageToast, MessageBox) {
	"use strict";

	var oConnection = new WebSocket("/wss/chat");

	return BaseController.extend("com.demo.websocket.controller.App", {

		onInit: function() {
			// make everything inside this View appear in Compact mode
			this.getView().addStyleClass("sapUiSizeCompact");

			// server messages
			oConnection.attachMessage(function(oEvent) {
				var oModel = this.getModel("chatModel");
				var oChatData = oModel.getData();

				var oMessage = jQuery.parseJSON(oEvent.getParameter("data"));
				var sMessage = `${oMessage.user}: ${oMessage.text}`,
					sChatHistory = oChatData.chat;

				if (sChatHistory.length > 0) {
					sChatHistory += "\r\n";
				}

				oModel.setData({
					chat: sChatHistory + sMessage
				}, true);
			}.bind(this));

			// error handling
			oConnection.attachError(function() {
				MessageToast.show("Websocket connection error");
			});

			// onConnectionClose
			oConnection.attachClose(function() {
				MessageToast.show("Websocket connection closed");
			});
		},

		// send message
		sendMsg: function() {
			var oModel = this.getModel("chatModel");
			var oMessage = oModel.getData();
			var sMessage = oMessage.message;
			if (sMessage.length > 0) {
				oConnection.send(JSON.stringify({
					user: oMessage.user,
					text: oMessage.message
				}));
				oModel.setData({
					message: ""
				}, true);
			}
		},

		onErrorCall: function(oError) {
			if (oError.statusCode === 500 || oError.statusCode === 400 || oError.statusCode === "500" || oError.statusCode === "400") {
				var oResponse = JSON.parse(oError.responseText);
				if (!oResponse.error.innererror) {
					MessageBox.alert(oResponse.error.message.value);
				} else {
					if (!oResponse.error.innererror.message) {
						MessageBox.alert(oResponse.error.innererror.toString());
					} else {
						MessageBox.alert(oResponse.error.innererror.message);
					}
				}
				return;
			} else {
				MessageBox.alert(oError.response.statusText);
				return;
			}

		}
	});
});