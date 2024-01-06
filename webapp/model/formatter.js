	sap.ui.define([], function () {
		"use strict";

		return {
			confirmedFormatText: function (sValue) {
				switch (sValue) {
				case "01":
					return "Onayda";
				case "02":
					return "Onaylandı";
				case "03":
					return "Reddedildi";
				}
			},
			sayimIdFormatter: function (sValue) {

				return sValue.slice(8);

			},
			AdetFormatter: function (sValue) {

				return sValue;

			},
			confirmedState: function (sValue) {
				switch (sValue) {
				case "01":
					return "Success";
				case "02":
					return "Warning";
				case "03":
					return "Error";
				}

			}

		};
	});