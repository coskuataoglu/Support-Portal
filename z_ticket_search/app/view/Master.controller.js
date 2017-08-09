
//	sap.ui.define(['sap/m/MessageBox','sap/ui/model/Filter'], function(MessageBox,Filter) {
//	"use strict";
//	var appName = "a41s.go.test1";
//	return sap.ui.controller(appName+".view.Master", {
//		onListItemPress:function(ev){
//			
////			var listitem = ev.getParameters.listItem;
//		},
//		buttonpress:function(){
//			var Route = sap.ui.core.UIComponent.getRouterFor(this);
//			Route.navTo("goHelp");
//		},
//		handleLinkPress: function (evt) {
//			jQuery.sap.require("sap.m.MessageBox"); 
//			MessageBox.alert(('Id'));
//		},	
//		onNavBack : function (sRoute, mData) {
//			var prevHash = sap.ui.core.routing.History.getInstance().getPreviousHash();
//			if (prevHash !== undefined) {
//				window.history.back();
//			} else {
//				window.location = '#';
//			}
//		}	
//
//	});
//});

sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/Filter',
	'sap/ui/model/Sorter',
	'sap/ui/table/SortOrder',
	'sap/ui/model/json/JSONModel',
	'sap/ui/commons/ComboBox',
	'sap/ui/core/util/Export',
	'sap/ui/core/util/ExportTypeCSV'
], function(jQuery, Controller, Filter, Sorter,SortOrder, JSONModel,ComboBox,Export,ExportTypeCSV) {
	"use strict";
	var appName = "a41s.go.test1";
	
	return sap.ui.controller(appName+".view.Master", {
		onInit: function () {
		var sServiceUrl = "proxy/http/a41103.sapprd.all-for-one.net:8800/sap/opu/odata/sap/Z_TICKET_SEARCH_SRV/";
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl,true);  
		
		
		var oJsonModel = new sap.ui.model.json.JSONModel(); 
	
		 
		
//		oModel.read("/ticket_s",null,null,true,function(oData,repsonse){oJsonModel.setData(oData)});
		sap.ui.getCore().setModel(oJsonModel); 
		this.getView().setModel(oModel); 
		 
	
		
			this.aKeys = ["Id", "Name", "Surname"];
			this.oSelectName = this.getSelect("slId");
			this.oSelectCategory = this.getSelect("slName");
			this.oSelectSupplierName = this.getSelect("slSurname");
//			this.oModel.setProperty("/Filter/text", "Filtered by None");
//			this.addSnappedLabel();
		},
		
		doReload : function(aFilters) {
		    var oTable = this.byId("idProductsTable");
		    var oBinding = oTable.getBinding("rows");
		    oBinding.filter(aFilters);
		},

		onReset : function(oEvent) {
		    this.doReload();
		},

		onSearch : function(oEvt) {
		    var oFilterBar = oEvt.getSource(), aFilters = [];
		    aFilters = oEvt.getParameter("selectionSet");
		    this.doReload(aFilters);
		},
  
		onSortID: function(){ 
			this._sorter.bDescending =!this._sorter.bDescending;
			this.byId("idProductsTable").getBinding("rows").sort(this._sorter);
			},
		onExit: function () {
			this.aKeys = [];
			this.aFilters = [];
			this.oModel = null;
		}, 
		onSelectChange: function() {
//			var id =  this.oSelectName.getSelectedItem().getText();
//			var filter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, id);
//			this.getTableItems().filter([filter]);
//			return;
//			var aCurrentFilterValues = [];
// 
//			aCurrentFilterValues.push(this.getSelectedItemText(this.oSelectName));
//			aCurrentFilterValues.push(this.getSelectedItemText(this.oSelectCategory));
//			aCurrentFilterValues.push(this.getSelectedItemText(this.oSelectSupplierName));
// 
//			this.filterTable(aCurrentFilterValues);
		},
 
		filterTable: function (aCurrentFilterValues) {
			this.getTableItems().filter(this.getFilters(aCurrentFilterValues));
			this.updateFilterCriterias(this.getFilterCriteria(aCurrentFilterValues));
		},
 
		updateFilterCriterias : function (aFilterCriterias) {
			this.removeSnappedLabel(); /* because in case of label with an empty text, */
			this.addSnappedLabel(); /* a space for the snapped content will be allocated and can lead to title misalignment */
//			this.oModel.setProkperty("/Filter/text", this.getFormattedSummaryText(aFilterCriterias));
		},
 
		getFilters: function (aCurrentFilterValues) {
			this.aFilters = [];
 
			this.aFilters = this.aKeys.map(function (sCriteria, i) {
				return new sap.ui.model.Filter(sCriteria, sap.ui.model.FilterOperator.Contains, aCurrentFilterValues[i]);
			});
 
			return this.aFilters;
		},
		getFilterCriteria : function (aCurrentFilterValues){
			return this.aKeys.filter(function (el, i) {
				if (aCurrentFilterValues[i] !== "") return  el;
			});
		},
		getFormattedSummaryText : function (aFilterCriterias) {
			if (aFilterCriterias.length > 0) {	
				return "Filtered by (" + aFilterCriterias.length + "): " + aFilterCriterias.join(", ");
			} else {
				return "Filtered by None";
			}
		},
 
		getTable : function () { 
			return this.getView().byId("idProductsTable");
			
		},
		getTableItems : function () {
			return this.getTable().getBinding("rows");
		},
		getSelect : function (sId) {
			return this.getView().byId(sId);
		},
		getSelectedItemText : function (oSelect) {
			return oSelect.getSelectedItem() ? oSelect.getSelectedItem().getText() : ""; 
		},
		getPage : function() {
			return this.getView().byId("dynamicPageId");
		},
		getPageTitle: function() {
			return this.getPage().getTitle();
		},
		getSnappedLabel : function () {
			return new sap.m.Label({text: "{/Filter/text}"});
		},
		handleSuchen : function (oEvent) {   	
		   var filter, filters = [];
		   

			   
		       var sTerm = this.getView().byId("Input").getValue();   
		       var SType = this.getView().byId("selectList");
		       if ( SType.getSelectedKey() == "Id" ) {
		       var filter = new sap.ui.model.Filter("ObjectId", sap.ui.model.FilterOperator.EQ, sTerm); 
				} else if ( SType.getSelectedKey() == "Pr" ) {
					filter = new sap.ui.model.Filter("Priority", sap.ui.model.FilterOperator.EQ, sTerm);
				} else if ( SType.getSelectedKey() == "Cp" ) {
					filter = new sap.ui.model.Filter("CompanyNr", sap.ui.model.FilterOperator.EQ, sTerm);					
				}  else 
			    filters.push(filter); 
	            this.getTableItems().filter([filter]); 
	            total_ticket = this.getTableItems().getLength();     
				this.getView().byId("idProductsTable").setTitle("Number of Tickets : "+total_ticket);  

	
		},
//		onSearch : function (ev) {
//			var filter, filters = [];
//			var query = ev.getParameter("query");
//			if (query && query.length > 0) {
//				var SType = this.getView().byId("SearchType"); 
//
//				if ( SType.getSelectedKey() == "Id" ) {
//					filter = new sap.ui.model.Filter("ObjectId", sap.ui.model.FilterOperator.EQ, query);
//				} else if ( SType.getSelectedKey() == "Pr" ) {
//					filter = new sap.ui.model.Filter("Priority", sap.ui.model.FilterOperator.EQ, query);
//				} else if ( SType.getSelectedKey() == "Cp" ) {
//					filter = new sap.ui.model.Filter("CompanyNr", sap.ui.model.FilterOperator.EQ, query);					
//				}  else 
//				
//				filters.push(filter); 
//			} else {
//				filter = new sap.ui.model.Filter("ObjectId", sap.ui.model.FilterOperator.EQ, query);
//				this.getTableItems().filter([filter]);
//				return;
//			}
//            this.getTableItems().filter([filter]);
//			return;
//			var aCurrentFilterValues = [];
//
//			aCurrentFilterValues.push(this.getSelectedItemText(this.oSelectName));   
//			
//		},
		onAddNewRow:function(ev){ 
			count ++;
				var grid = this.byId('verticalLayout'); 
				var toolbar = new sap.m.Toolbar('testToolbar'+count);
				var selectList = new sap.m.Select('selectList'+count,{"width" : "30%"});
				var testInput = new sap.m.Input('Input'+count,{"width" : "30%"});
				var testButtonAdd = new sap.m.Button('ButtonAdd'+count,{icon : "sap-icon://add" , press:[this.onAddNewRow,this]});
				var testButtonDelete = new sap.m.Button('ButtonRemove'+count,{icon : "sap-icon://delete",press:[this.onRemoveLastRow,this]}).data("ordernum",count);
				selectList.addItem( new sap.ui.core.Item({key: "Id",text : "Incident ID"}));
				selectList.addItem( new sap.ui.core.Item({key: "Pr",text : "Priority"}));
				selectList.addItem( new sap.ui.core.Item({key: "Cp",text : "Company Name"}));
				toolbar.addContent(selectList); 
				toolbar.addContent(testInput); 
				toolbar.addContent(testButtonAdd); 
				toolbar.addContent(testButtonDelete);  
				grid.addContent(toolbar);
			
			
		},
		onRemoveLastRow:function(ev){
			var grid = this.byId('verticalLayout'); 
			var rowToDelete = ev.getSource().data('ordernum');
			var objectIdToDelete = "testToolbar" + rowToDelete;
			var objectToDelete = sap.ui.getCore().byId( objectIdToDelete );
			grid.removeContent(objectToDelete);
			
		},
		exportToExcel:function(){
			 
		}
	});
});
