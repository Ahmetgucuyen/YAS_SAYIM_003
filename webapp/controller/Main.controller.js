sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"../model/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, MessageBox, formatter, JSONModel, Filter, FilterOperator) {
	"use strict";

	var userData = {};
	var oView;
	var TalepListView = [];
	var TalepListSelectedData = [];
	var TalepListSelectedData1 = [];
	var TalepListSelectedDataNavigate = [];
	var datasicil = [];
	var uniqeIstatu = [];
	var ekleneceksicil = "";
	var eklenecekMagazaKodu = "";
	var girilenBilgiler = [];
	var magazaKodlari = [];

	return Controller.extend("app.YAS_SAYIM_003.controller.Main", {
		formatter: formatter,

		onInit: function () {
			// userData.Username = sap.ushell.Container.getService("UserInfo").getId();
			// oView = this.getView();
			// this.getOwnerComponent().getRouter().getRoute("TargetSayimList").attachMatched(this._onRouteMatched, this);
			// this.getOwnerComponent().getRouter().getRoute("RouteDetail")
		},

		_onRouteMatched: function (oEvent) {
			/*en son 3 yap unutmaaa test için 1 yap*/
			this.getTalepList("3");
			//route gelene kadar.
			uniqeIstatu = [];

			uniqeIstatu.push({
				IstatuKey: "1",
				IstatuDesc: "Yeni Talep"
			});
			uniqeIstatu.push({
				IstatuKey: "2",
				IstatuDesc: "Sayım Devam Ediyor"
			});
			uniqeIstatu.push({
				IstatuKey: "3",
				IstatuDesc: "Sayım Tamamlandı"
			});

			this.bindView();
		},

		onSelectionChange: function (oEvent) {
			TalepListSelectedDataNavigate = [];
			TalepListSelectedDataNavigate = oEvent.getSource().getSelectedContexts()[0].getObject();

			// this.bindView();

			this._getRouter().navTo("TargetDetail", {
				Werks: TalepListSelectedDataNavigate.Werks,
				sayim_id: TalepListSelectedDataNavigate.SayimId,

				Lgort: TalepListSelectedDataNavigate.Lgort
			});

			sap.ui.getCore().getEventBus().publish("channelName", "eventName", {});
		},
		onValueHelpBukrs: function () {
			var oModel = this.getView();
			if (!this._bukrsSH) {
				this._bukrsSH = sap.ui.xmlfragment("app.YAS_SAYIM_003.view.fragments.BukrsSH", this);
				oModel.addDependent(this._bukrsSH);
				this._bukrsSH.open();
			} else {
				oModel.addDependent(this._bukrsSH);
				this._bukrsSH.open();
			}
		},
		onValueHelpWerks: function () {
			var oModel = this.getView();
			if (!this._werksSH) {
				this._werksSH = sap.ui.xmlfragment("app.YAS_SAYIM_003.view.fragments.WerksSH", this);
				oModel.addDependent(this._werksSH);
				this._werksSH.open();
			} else {
				oModel.addDependent(this._werksSH);
				this._werksSH.open();
			}
			// var oBinding = this._werksSH.getBinding("items");
			// var oFilter2 = new sap.ui.model.Filter("ItBukrs", sap.ui.model.FilterOperator.EQ, sFilterValueBukrs);

			// var oFilter1 = new sap.ui.model.Filter("IvCountry", sap.ui.model.FilterOperator.EQ, sFilterValueSehir);
			// var oFilter = [oFilter1, oFilter2];
			// oBinding.filter([oFilter2]);
			// this._werksSH.setNoDataText("Şirket Kodu Seçiniz");
		},
		onValueHelpLgort: function () {
			var oModel = this.getView();
			if (!this._lgortSH) {
				this._lgortSH = sap.ui.xmlfragment("app.YAS_SAYIM_003.view.fragments.LgortSH", this);
				oModel.addDependent(this._lgortSH);
				this._lgortSH.open();
			} else {
				oModel.addDependent(this._lgortSH);
				this._lgortSH.open();
			}
			// var oBinding = this._lgortSH.getBinding("items");
			// var oFilter2 = new sap.ui.model.Filter("Werks", sap.ui.model.FilterOperator.EQ, sFilterValueWerks);

			// var oFilter1 = new sap.ui.model.Filter("IvCountry", sap.ui.model.FilterOperator.EQ, sFilterValueSehir);
			// var oFilter = [oFilter1, oFilter2];
			// oBinding.filter([oFilter2]);
			// this._lgortSH.setNoDataText("Üretim Yeri Seçiniz");
		},
		_confirmBukrsSH: function (e) {
			var t = e.getParameter("selectedContexts");
			if (t && t.length) {
				var s = t[0].getProperty("Bukrs");
				// var g = t[0].getProperty("Bezei");
				e.getSource().getBinding("items").filter([]);
				this.byId("BukrsInput").setValue(s);
				// this.byId("idSehirr").setValue(g);
				// sFilterValueBukrs = s;

			}
			// this.getView().byId("idWerks").setValue("");

			// this.getView().byId("idLgort").setValue("");

		},
		_confirmWerksSH: function (e) {
			var t = e.getParameter("selectedContexts");
			if (t && t.length) {
				var s = t[0].getProperty("Werks");
				// var g = t[0].getProperty("Bezei");
				e.getSource().getBinding("items").filter([]);
				this.byId("WerksInput").setValue(s);
				// this.byId("idSehirr").setValue(g);
				// sFilterValueWerks = s;

			}
			// this.getView().byId("idLgort").setValue("");

		},
		_confirmLgortSH: function (e) {
			var t = e.getParameter("selectedContexts");
			if (t && t.length) {
				var s = t[0].getProperty("Lgort");
				// var g = t[0].getProperty("Bezei");
				e.getSource().getBinding("items").filter([]);
				this.byId("LgortInput").setValue(s);
				// this.byId("idSehirr").setValue(g);
				// sFilterValueWerks = s;

			}
			// this.getView().byId("idLgort").setValue("");

		},
		_searchBukrsSH: function (oEvent) {

			var oFilter = [];
			var sValue = oEvent.getParameter("value");
			if (isNaN(parseInt(sValue.slice(-1)))) {
				oFilter = new Filter("Butxt", FilterOperator.Contains, sValue);

			} else {
				oFilter = new Filter("Bukrs", FilterOperator.Contains, sValue);
			}
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		_searchWerksSH: function (oEvent) {

			var oFilter = [];
			var sValue = oEvent.getParameter("value");
			if (isNaN(parseInt(sValue.slice(-1)))) {
				oFilter = new Filter("Name1", FilterOperator.Contains, sValue);

			} else {
				oFilter = new Filter("Werks", FilterOperator.Contains, sValue);
			}
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		_searchLgortSH: function (oEvent) {

			var oFilter = [];
			var sValue = oEvent.getParameter("value");
			if (isNaN(parseInt(sValue.slice(-1)))) {
				oFilter = new Filter("Lgobe", FilterOperator.Contains, sValue);

			} else {
				oFilter = new Filter("Lgort", FilterOperator.Contains, sValue);
			}
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		onSearch: function () {

			var aFilter = [];
			var that = this;
			var oModel = this.getOwnerComponent().getModel();

			// tableMainList = [];
			//var form = this.getView().byId("idDurumRaporuFormnoGecmis").getValue().toUpperCase();
			aFilter.push(new Filter("Bukrs", FilterOperator.Contains, this.getView().byId("BukrsInput").getValue()));
			aFilter.push(new Filter("Lgort", FilterOperator.Contains, this.getView().byId("LgortInput").getValue()));
			aFilter.push(new Filter("Werks", FilterOperator.Contains, this.getView().byId("WerksInput").getValue()));
			var durum = this.getView().byId("idStatu").getSelectedKey();
			// durum = durum.slice(1);
			aFilter.push(new Filter("Statu", FilterOperator.EQ, durum));
			this.getView().byId("list").getBinding("items").filter(aFilter);

		},
		_getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		getTalepList: function (IStatu1) {

			var that = this;
			var Kostl = "";
			var Ktext = "";
			var Pernr = "";
			var Ename = "";
			var filters = [];

			var oviewModel = that.getOwnerComponent().getModel();

			sap.ui.core.BusyIndicator.show();
			var sFilter = new sap.ui.model.Filter("IStatu", sap.ui.model.FilterOperator.EQ, IStatu1);
			filters.push(sFilter);

			oviewModel.read("/GetMasterSaySonucSet", {
				filters: filters,
				urlParameters: {
					/*	"$select": "IStatu",*/
					"$expand": "NAVTEPERNR,NAVETKOSTL"
				},

				method: "GET",
				success: function (oData) {
					TalepListView = [];
					for (var mt = 0; mt < oData.results.length; mt++) {
						/*	sayac = 0;*/
						Kostl = "";
						Ktext = "";
						Pernr = "";
						for (var mt1 = 0; mt1 < oData.results[mt].NAVETKOSTL.results.length; mt1++) {
							if (mt1 === 0) {
								Kostl = oData.results[mt].NAVETKOSTL.results[mt1].Kostl;
								Ktext = oData.results[mt].NAVETKOSTL.results[mt1].Ktext;
							} else {
								Kostl = Kostl + "," + oData.results[mt].NAVETKOSTL.results[mt1].Kostl;
								Ktext = Ktext + "," + oData.results[mt].NAVETKOSTL.results[mt1].Ktext;
							}
						}
						for (var mt2 = 0; mt2 < oData.results[mt].NAVTEPERNR.results.length; mt2++) {
							/*	sayac = sayac + 1;*/
							if (mt2 === 0) {
								Pernr = oData.results[mt].NAVTEPERNR.results[mt2].Pernr;
							} else {
								/*								if (sayac === 10) {
																	Pernr = Pernr + "\n" + oData.results[mt].NAVTEPERNR.results[mt2].Pernr;
																	sayac = 0;
																} else {*/
								Pernr = Pernr + "," + oData.results[mt].NAVTEPERNR.results[mt2].Pernr;
								/*}*/
							}
						}

						TalepListView.push({
							Bukrs: oData.results[mt].Bukrs,
							IStatu: oData.results[mt].IStatu,
							Kostl: Kostl,
							Ktext: Ktext,
							Pernr: Pernr,
							Period: oData.results[mt].Period,
							Saat: oData.results[mt].Saat,
							SayimId: oData.results[mt].SayimId,
							SayimStatu: oData.results[mt].SayimStatu,
							Tarih: oData.results[mt].Tarih
						});
					}

					that.bindView();

					var oList = that.getView().byId("list");
					oList.getBinding("items").refresh();

					sap.ui.core.BusyIndicator.hide();
				},
				error: function (oError) {
					sap.m.MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},

		onSearch1: function (oEvent) {
			var aFilters = [];
			//	var sQuery = oEvent.getSource().getValue();

			if (eklenecekMagazaKodu.Kostl === "" || eklenecekMagazaKodu.Kostl === null || eklenecekMagazaKodu.Kostl === undefined) {

			} else {
				var filter = new Filter("Kostl", FilterOperator.Contains, eklenecekMagazaKodu.Kostl);
				aFilters.push(filter);
			}

			if (ekleneceksicil.Pernr === "" || ekleneceksicil.Pernr === null || ekleneceksicil.Pernr === undefined) {

			} else {
				var filter = new Filter("Pernr", FilterOperator.Contains, ekleneceksicil.Pernr);
				aFilters.push(filter);
			}
			/*	if (sQuery && sQuery.length > 0) {
					var filter = new Filter("SayimId", FilterOperator.Contains, sQuery);
					aFilters.push(filter);
				}*/

			// update list binding
			var oList = this.byId("list");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilters, "Application");
		},

		onFilterList: function () {
			this._getDialog2().open();
		},

		_getDialog2: function () {
			if (!this._oDialog2) {
				this._oDialog2 = sap.ui.xmlfragment("app.ZPRD_DV_SAY_SONUC.fragments.filtersearch", this);
				this.getView().addDependent(this._oDialog2);
			}
			return this._oDialog2;
		},

		onAraClose: function () {
			this._getDialog2().close();
		},

		onSearchfilter: function (oEvent) {
			var index = sap.ui.getCore().byId("idTabled").getSelectedContexts()[0].sPath.split("/")[2];
			var SelectPop = uniqeIstatu[index].IstatuDesc;
			var oTable = this.getView().byId("idTable");
			var r = [];
			var t = "";
			if (uniqeIstatu[index].IstatuDesc == "Yeni Talep") {
				t = "1";
			}
			if (uniqeIstatu[index].IstatuDesc == "Sayım Devam Ediyor") {
				t = "2";
			}
			if (uniqeIstatu[index].IstatuDesc == "Sayım Tamamlandı") {
				t = "3";
			}

			this.getTalepList(t);
			this._getDialog2().close();
		},

		bindView: function () {

			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({
				TalepListView: TalepListView,
				TalepListSelectedData: TalepListSelectedData,
				TalepListSelectedData1: TalepListSelectedData1,
				TalepListSelectedDataNavigate: TalepListSelectedDataNavigate,
				datasicil: datasicil,
				uniqeIstatu: uniqeIstatu
			});

			this.getView().setModel(oModel, "oViewModel");
			this.getView().getModel("oViewModel").refresh(true);
		},
		magazaKoduValueHelp: function (oEvent) {

			this._magazaKoduValueHelp = sap.ui.getCore().byId("magazaKoduValueHelp");
			if (!this._magazaKoduValueHelp) {
				this._magazaKoduValueHelp = sap.ui.xmlfragment("app.ZPRD_DV_SAY_SONUC.fragments.magazaKoduValueHelp", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._magazaKoduValueHelp);
			this._magazaKoduValueHelp.open();

			var magazakoduAraDialogModel = new sap.ui.model.json.JSONModel();
			magazakoduAraDialogModel.setData({
				filterData: {
					Kostl: girilenBilgiler.magazaKodu,
					Mctxt: girilenBilgiler.magazaAdi,
					Bukrs: girilenBilgiler.sirketKodu
				},
				items: []
			});

			this._magazaKoduValueHelp.setModel(magazakoduAraDialogModel);

		},

		handleMagazaKoduAra: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelMagazaKoduArama = this._magazaKoduValueHelp.getModel();
			var oDataMagazaKoduArama = oModelMagazaKoduArama.getData();
			var aFilters = [];

			if (oDataMagazaKoduArama.filterData.Kostl) {
				aFilters.push(new sap.ui.model.Filter("Kostl", sap.ui.model.FilterOperator.Contains, oDataMagazaKoduArama.filterData.Kostl));
			}

			if (oDataMagazaKoduArama.filterData.Mctxt) {
				aFilters.push(new sap.ui.model.Filter("Mctxt", sap.ui.model.FilterOperator.Contains, oDataMagazaKoduArama.filterData.Mctxt));
			}

			if (oDataMagazaKoduArama.filterData.Name1) {
				aFilters.push(new sap.ui.model.Filter("Spras", sap.ui.model.FilterOperator.Contains, "TR"));
			}

			if (oDataMagazaKoduArama.filterData.Bukrs) {
				aFilters.push(new sap.ui.model.Filter("Bukrs", sap.ui.model.FilterOperator.Contains, oDataMagazaKoduArama.filterData.Bukrs));
			}

			aFilters.push(new sap.ui.model.Filter("Kokrs", sap.ui.model.FilterOperator.Contains, "2800"));

			this.getMagazaKoduData(aFilters);

		},

		getMagazaKoduData: function (filters) {
			var that = this;
			magazaKodlari = [];
			var oDataModel = this.getOwnerComponent().getModel();

			sap.ui.core.BusyIndicator.show();

			oDataModel.read("/ZfiDcSh002Set", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters,
			});

			function mySuccessHandler(data, response) {
				for (var mt = 0; mt < data.results.length; mt++) {
					if (magazaKodlari.findIndex(o => o.Kostl == data.results[mt].Kostl) === -1) {
						magazaKodlari.push({
							Kostl: data.results[mt].Kostl,
							Mctxt: data.results[mt].Mctxt,
							Bukrs: data.results[mt].Bukrs
						});
					}
				}
				var dialogData = that._magazaKoduValueHelp.getModel().getData();
				dialogData.items = magazaKodlari;
				that._magazaKoduValueHelp.getModel().refresh(true);
				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
			return magazaKodlari;
		},

		handleMagazaKoduSec: function (oEvent) {

			eklenecekMagazaKodu = oEvent.getSource().getBindingContext().getObject();
			girilenBilgiler.magazaKodu = eklenecekMagazaKodu.Kostl;
			girilenBilgiler.magazaKoduSirketi = eklenecekMagazaKodu.Bukrs;
			oView.byId("magazaKoduInput").setValue(eklenecekMagazaKodu.Kostl);

			this._magazaKoduValueHelp.destroy();

		},

		magazaKoduValueHelpClose: function () {
			this._magazaKoduValueHelp.destroy();
		},

		sicilValueHelp: function (oEvent) {
			this._sicilValueHelp = sap.ui.getCore().byId("sicilValueHelp");
			if (!this._sicilValueHelp) {
				this._sicilValueHelp = sap.ui.xmlfragment("app.ZPRD_DV_SAY_SONUC.fragments.sicilValueHelp", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._sicilValueHelp);
			this._sicilValueHelp.open();

			var sicilAraDialogModel = new sap.ui.model.json.JSONModel();
			sicilAraDialogModel.setData({
				filterData: {
					Kostl: eklenecekMagazaKodu.Kostl,
					Pernr: "",
					Ename: ""
				},
				items: []
			});

			this._sicilValueHelp.setModel(sicilAraDialogModel);

		},

		handleSicilAra: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelsicilArama = this._sicilValueHelp.getModel();
			var oDatasicilArama = oModelsicilArama.getData();
			var aFilters = [];

			if (oDatasicilArama.filterData.Pernr) {
				aFilters.push(new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.Contains, oDatasicilArama.filterData.Pernr));
			}

			if (oDatasicilArama.filterData.Ename) {
				aFilters.push(new sap.ui.model.Filter("Ename", sap.ui.model.FilterOperator.Contains, oDatasicilArama.filterData.Ename));
			}
			if (eklenecekMagazaKodu.Kostl) {
				aFilters.push(new sap.ui.model.Filter("Kst01", sap.ui.model.FilterOperator.Contains, eklenecekMagazaKodu.Kostl));
			}
			/*			var masraftoken = this.byId("magazaKoduInput").getTokens();

						for (var i = 0; i < masraftoken.length; i++) {
							aFilters.push(new sap.ui.model.Filter("Kostl", sap.ui.model.FilterOperator.Contains, masraftoken[i].getText()));
						}*/

			this.getsicilData(aFilters);

		},

		getsicilData: function (filters) {
			var that = this;
			var siciller = [];
			var oDataModel = this.getOwnerComponent().getModel();
			// var aFilters = [];
			// aFilters.push(filters);

			oDataModel.read("/SicilSHSet", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters,
			});

			function mySuccessHandler(data, response) {
				/*	for (var mt = 0; mt < data.results.length; mt++) {
						if (siciller.findIndex(o => o.Pernr == data.results[mt].Pernr) === -1) {
							siciller.push({
								Pernr: data.results[mt].Pernr,
								Ename: data.results[mt].Ename,
								Kostl: data.results[mt].Kostl
							});
						}
					}*/
				siciller = data.results;
				var dialogData = that._sicilValueHelp.getModel().getData();
				dialogData.items = siciller;
				that._sicilValueHelp.getModel().refresh(true);
				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
			return siciller;
		},

		handleSicilSec: function (oEvent) {

			ekleneceksicil = oEvent.getSource().getBindingContext().getObject();
			girilenBilgiler.sicil = ekleneceksicil.Pernr;
			girilenBilgiler.siciladi = ekleneceksicil.Ename;

			oView.byId("SicilInput").setValue(ekleneceksicil.Pernr);
			this._sicilValueHelp.destroy();

		},

		SicilValueHelpClose: function () {
			this._sicilValueHelp.destroy();
		}
	});
});