sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox",
    "sap/m/BusyDialog"
], function (Controller, UIComponent, MessageBox, BusyDialog ) {
    "use strict";

    let oBusyDialog = new BusyDialog();
    return Controller.extend("zcapmedia.controller.BaseController", {
        /**
         * Convenience method for accessing the router.
         * @public
         * @returns {sap.ui.core.routing.Router} the router for this component
         */
        getRouter : function () {
            return UIComponent.getRouterFor(this);
        },

        /**
         * Convenience method for getting the view model by name.
         * @public
         * @param {string} [sName] the model name
         * @returns {sap.ui.model.Model} the model instance
         */
        getModel : function (sName) {
            return this.getView().getModel(sName);
        },

        /**
         * Convenience method for setting the view model.
         * @public
         * @param {sap.ui.model.Model} oModel the model instance
         * @param {string} sName the model name
         * @returns {sap.ui.mvc.View} the view instance
         */
        setModel : function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        /**
         * Getter for the resource bundle.
         * @public
         * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
         */
        getResourceBundle : function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        _setAppBusy : function(flag){
            if(flag){
                oBusyDialog.open();
            }else{
                oBusyDialog.close();
            }
        },
        _displayInfoMsgDialog : function(infoMsg){
            MessageBox.information(infoMsg)
        },
        _displayWarnMsgDialog : function(warnMsg){
            MessageBox.warning(warnMsg)
        },
        _displaySuccessMsgDialog : function(succMsg){
            MessageBox.success(succMsg)
        },
        _displayErrorMsgDialog : function(errMsg){
            MessageBox.error(errMsg)
        }
    });

});