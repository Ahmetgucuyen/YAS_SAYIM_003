var sayimId;
var Werks;
var Lgort;
var binding;

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/Filter",

	"sap/m/MessageBox",
	// "../model/formatter",
	"sap/ui/model/FilterOperator"
], function (Controller, ODataModel, Filter, MessageBox, FilterOperator) {
	"use strict";

	return Controller.extend("app.YAS_SAYIM_003.controller.Detail", {
		onInit: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("TargetDetail").attachMatched(this._onRouteMatched, this);
			var viewModel = new sap.ui.model.json.JSONModel({

				sayimId: undefined,
				Werks: undefined,
				Lgort: undefined
			});
			this.getView().setModel(viewModel, "viewModel");
			// this.getList();

			sap.ui.getCore().getEventBus().subscribe("channelName", "eventName", this.onEventTriggered, this);
		},
		sayimFormatter: function (sStatu) {
			if (sStatu !== null) {
				return sStatu.slice(8);
			}
		},
		onEventTriggered: function (channel, event, data) {
			// İlgili fonksiyonu burada çağır

			// this.onBeforeRebindTable();
		},
		onTamamla: function () {
			var smarttable1 = this.getView().byId("idTableCMMGirisRaporlama");
			var smartTableId = "LineItemsSmartTable";
			var tableId = "idTableCMMGirisRaporlama";
			var oEntry = {};

			// SmartTable elemanını al
			var smartTable = this.getView().byId(smartTableId);

			// Table elemanını al
			var table = this.getView().byId(tableId);

			// Seçilen satırları al
			var selectedIndices = table.getSelectedIndices();
			var selectedItems1 = [];
			var rapor = [];
			var selectedDataMatnr = {};

			selectedIndices.forEach(function (index) {
				var context = table.getContextByIndex(index);
				var selectedData = context.getObject();
				if (!selectedData.Fark.startsWith("0.00")) {
					var selectedDataMatnr = {
						Matnr: selectedData.Matnr,
						SayimId: selectedData.SayimId,
						Fark: selectedData.Fark
					};
					var rapormatnr = {
						Matnr: selectedData.Matnr,
						Mesaj: ""
					};
					// selectedDataMatnr.Matnr = selectedData.Matnr
					// selectedDataMatnr.SayimId = selectedData.SayimId
					// selectedDataMatnr.Fark = selectedData.Fark
					selectedItems1.push(selectedDataMatnr);
					rapor.push(rapormatnr);
				}
			});
			oEntry.SayimId = sayimId;
			oEntry.NAVTALEPBAPI = selectedItems1;
			oEntry.NAVTALEPRETURN = [{
				"Id": "",
				"Number": "",
				"Message": "",
				"Type": ""
			}];
			// console.log("Seçilen Satırlar:", selectedItems);

			var oModel = this.getView().getModel();
			// var NAVHEADERTOKOD = [];
			// var NAVHEADERTORET = [];
			// oEntry = {
			// 	"SayimId": "100000000001",

			// 	"NAVTALEPKAYIT": [{
			// 		"SayimId": "100000000001",
			// 		"Matnr": "6"
			// 	}, {
			// 		"SayimId": "100000000001",
			// 		"Matnr": "9"
			// 	}],
			// 	"NAVTALEPRETURN": [{
			// 		"Id": "",
			// 		"Number": "",
			// 		"Message": "",
			// 		"Type": ""
			// 	}]
			// }

			oModel.create("/TalepListesi1Set", oEntry, {

				success: function (data) {
					// var mesaj = data.NAVTALEPRETURN.results[1].Message;
					// MessageBox.information(mesaj);
					var length = data.NAVTALEPRETURN.results.length;
					for (var i = 1; i < length; i++) {
						rapor[i - 1].Mesaj = data.NAVTALEPRETURN.results[i].Message
					}
					var message = "";

					rapor.forEach(function (item) {
						message += item.Matnr + " kodlu malzeme için " + item.Mesaj + "\n\n";
					});
					MessageBox.information(message);
				},
				error: function (e) {
					// var mesaj = e.Message;
					alert("error");
				},
			});

		},
		_confirmMatnrSH: function (e) {
			var t = e.getParameter("selectedContexts");
			if (t && t.length) {
				var s = t[0].getProperty("Matnr");
				// var g = t[0].getProperty("Bezei");
				e.getSource().getBinding("items").filter([]);
				this.byId("idMatnr").setValue(s);
				// this.byId("idSehirr").setValue(g);
				// sFilterValueBukrs = s;

			}
		},
		_searchMatnrSH: function (oEvent) {

			var oFilter = [];
			var sValue = oEvent.getParameter("value");
			if (isNaN(parseInt(sValue.slice(-1)))) {
				oFilter = new Filter("Maktx", FilterOperator.Contains, sValue);

			} else {
				oFilter = new Filter("Matnr", FilterOperator.Contains, sValue);
			}
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		onValueHelpMatnr: function () {
			var oModel = this.getView();
			if (!this._matnrSH) {
				this._matnrSH = sap.ui.xmlfragment("app.YAS_SAYIM_003.view.fragments.MatnrSH", this);
				oModel.addDependent(this._matnrSH);
				this._matnrSH.open();
			} else {
				oModel.addDependent(this._matnrSH);
				this._matnrSH.open();
			}
		},
		onBeforeRebindTable1: function (oEvent) {
			var oFilter = [];
			var oTable = this.getView().byId("LineItemsSmartTable");
			var oBinding = oEvent.getParameter("bindingParams");
			var oFilter1 = new Filter("SayimId", FilterOperator.EQ, sayimId);
			var oFilter2 = new Filter("Werks", FilterOperator.EQ, Werks);
			var oFilter3 = new Filter("Lgort", FilterOperator.EQ, Lgort);

			oFilter = [oFilter1, oFilter2, oFilter3]

			oBinding.filters.push(oFilter);

		},

		onPressedNavToMain: function () {
			this.getOwnerComponent().getRouter().navTo("TargetMain");
		},
		_onRouteMatched: function (oEvent) {
			sayimId = oEvent.getParameter("arguments").sayim_id;

			Werks = oEvent.getParameter("arguments").Werks;

			Lgort = oEvent.getParameter("arguments").Lgort;

			// Tablo = oEvent.getParameter("arguments").table;
			// sayimId'yi kullanarak gerekli işlemleri yapabilirsiniz
			var oView = this.getView();
			oView.getModel("viewModel").setProperty("/sayimId", sayimId.slice(8));

			oView.getModel("viewModel").setProperty("/Werks", Werks);

			oView.getModel("viewModel").setProperty("/Lgort", Lgort);

			// oView.getModel("viewModel").setProperty("/table", Tablo);
			setTimeout(function () {
				this.getView().byId("LineItemsSmartTable").rebindTable();
			}.bind(this), 300);
		},
		_getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		onBeforeRebindTable: function (oEvent) {
			var oFilter = [];
			var sSayimId = sayimId,
				// sKeyDvSonucu = this.byId("idKostl").getSelectedKey(),
				// sKeyKostl = this.byId("idKostl").getSelectedKey(),
				// sKeyKostlS = this.byId("idKostlS").getSelectedKey(),
				// sKeyPernr = this.byId("idPernr").getSelectedKey(),
				// sKeyPernrS = this.byId("idPernrS").getSelectedKey(),
				oFiltersKeyDv,
				oFiltersKeyKostl,
				oFiltersKeyKostlS,
				oFiltersKeyPernr,
				oFiltersKeyPernrS,
				oFilter1,
				oFilter2,
				oFilter4,
				oFilter5,
				oFilter3;
			// if (sSayimId) {

			oFilter1 = new sap.ui.model.Filter("IvWerks", sap.ui.model.FilterOperator.EQ, Werks);

			oFilter2 = new sap.ui.model.Filter("IvLgort", sap.ui.model.FilterOperator.EQ, Lgort);

			oFilter3 = new sap.ui.model.Filter("IvSayimId", sap.ui.model.FilterOperator.EQ, sSayimId);

			// oFilter = [oFilter1, oFilter2, oFilter3]
			// binding.filters.push(new sap.ui.model.Filter([oFilter1, oFilter2, oFilter3], false));

			binding = oEvent.getParameter("bindingParams");
			binding.filters.push(oFilter1);

			binding.filters.push(oFilter2);

			binding.filters.push(oFilter3);
			var matnrfilter = this.getView().byId("idMatnr").getValue();
			if (matnrfilter !== "") {

				oFilter4 = new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.Contains, matnrfilter);

				binding.filters.push(oFilter4);
			}
			var unamefilter = this.getView().byId("idUname").getValue().toUpperCase();
			if (unamefilter !== "") {

				oFilter5 = new sap.ui.model.Filter("Uname", sap.ui.model.FilterOperator.Contains, unamefilter);

				binding.filters.push(oFilter5);
			}
			// if (binding !== undefined) {
			// binding = oEvent.getParameter("bindingParams");
			// 	binding.filters.push(oFilter1);

			// 	binding.filters.push(oFilter2);

			// 	binding.filters.push(oFilter3);
			// }
			// oEvent.getSource().bindTable([oFilter1, oFilter2, oFilter3]);
			// binding.filter(oFilter);
			// }
			// if (sKeyDvSonucu) {
			// 	oFiltersKeyDv = new sap.ui.model.Filter("DvSonucu", sap.ui.model.FilterOperator.EQ, sKeyDvSonucu);
			// 	binding.filters.push(oFiltersKeyDv);
			// }
			// if (sKeyKostl) {
			// 	oFiltersKeyKostl = new sap.ui.model.Filter("Kostl", sap.ui.model.FilterOperator.EQ, sKeyKostl);
			// 	binding.filters.push(oFiltersKeyKostl);
			// }
			// if (sKeyKostl) {
			// 	oFiltersKeyKostl = new sap.ui.model.Filter("Kostl", sap.ui.model.FilterOperator.EQ, sKeyKostl);
			// 	binding.filters.push(oFiltersKeyKostl);
			// }
			// if (sKeyKostlS) {
			// 	oFiltersKeyKostlS = new sap.ui.model.Filter("KostlS", sap.ui.model.FilterOperator.EQ, sKeyKostlS);
			// 	binding.filters.push(oFiltersKeyKostlS);
			// }
			// if (sKeyPernr) {
			// 	oFiltersKeyPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, sKeyPernr);
			// 	binding.filters.push(oFiltersKeyPernr);
			// }
			// if (sKeyPernrS) {
			// 	oFiltersKeyPernr = new sap.ui.model.Filter("PernrS", sap.ui.model.FilterOperator.EQ, sKeyPernrS);
			// 	binding.filters.push(oFiltersKeyPernrS);
			// }

		},
	});
});