sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/base/Log"
],
    function (BaseController, JSONModel, MessageToast,Log) {
        "use strict";

        return BaseController.extend("zcapmedia.controller.MediaView", {
            onAfterRendering: function () {
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                this.appModulePath = sap.ui.require.toUrl(appPath);
            },
            onAfterItemAdded: function (oEvent) {
                var item = oEvent.getParameter("item")
                this._createEntity(item)
                    .then((id) => {
                        this._uploadContent(item, id);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            },
            _createEntity: async function (item) {
                var oPayload = {
                    mediaType: item.getMediaType(),
                    fileName: item.getFileName(),
                    size: item.getFileObject().size
                };

                
                let that = this;
                try {
                    const response = await fetch(that.appModulePath + "/mediapath/Attachments", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body : JSON.stringify(oPayload)
                    });
                    
                    if (!response.ok) {
                        const errorBody = await response.json().catch(() => ({}));
                        let erObj = {
                            "resStatus" : response.status,
                            "resMsg" : errorBody.error.message,
                            "details" : errorBody?.error?.details,
                            "target" : errorBody?.error?.target
                        }
                        throw erObj;
                    }else{
                        that._setAppBusy(false);
                        const succBody = await response.json().catch(() => ({}));
                        Log.info("Success:", succBody);
                        that._uploadContent();
                        
                    }
                }
                catch (error) {
                    that._setAppBusy(false);
                    
                    that._displayErrorMsgDialog(error.resMsg)
                    
                    Log.error("Error while getCustomerAccountById:", JSON.stringify(error));
                }
            },

             _uploadContent: function (item, id) {
                var url = that.appModulePath + `/mediapath/Attachments(${id})/content`
                item.setUploadUrl(url);
                var oUploadSet = this.byId("uploadSet");
                oUploadSet.setHttpRequestMethod("PUT")
                oUploadSet.uploadItem(item);
            },

            onUploadCompleted: function (oEvent) {
                var oUploadSet = this.byId("uploadSet");
                oUploadSet.removeAllIncompleteItems();
                oUploadSet.getBinding("items").refresh();
            },

            onRemovePressed: function (oEvent) {
                oEvent.preventDefault();
                oEvent.getParameter("item").getBindingContext().delete();
                MessageToast.show("Selected file has been deleted");
            },

            onOpenPressed: function (oEvent) {
                oEvent.preventDefault();
                var item = oEvent.getSource();
                this._fileName = item.getFileName();
                var that = this;
                this._download(item)
                    .then((blob) => {
                        var url = window.URL.createObjectURL(blob);
                        //						window.open(url);	
                        var link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', that._fileName);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            },

            _download: function (item) {
                var settings = {
                    url: item.getUrl(),
                    method: "GET",
                    headers: {
                        "Content-type": "application/octet-stream"
                    },
                    xhrFields: {
                        responseType: 'blob'
                    }
                }

                return new Promise((resolve, reject) => {
                    $.ajax(settings)
                        .done((result) => {
                            resolve(result)
                        })
                        .fail((err) => {
                            reject(err)
                        })
                });
            },

            

            /* _createEntity: function (item) {
                var data = {
                    mediaType: item.getMediaType(),
                    fileName: item.getFileName(),
                    size: item.getFileObject().size
                };

                var settings = {
                    url: "/mediapath/Attachments",
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    data: JSON.stringify(data)
                }

                return new Promise((resolve, reject) => {
                    $.ajax(settings)
                        .done((results, textStatus, request) => {
                            resolve(results.ID);
                        })
                        .fail((err) => {
                            reject(err);
                        })
                })
            }, */

           

            //formatters
            formatThumbnailUrl: function (mediaType) {
                var iconUrl;
                switch (mediaType) {
                    case "image/png":
                        iconUrl = "sap-icon://card";
                        break;
                    case "text/plain":
                        iconUrl = "sap-icon://document-text";
                        break;
                    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                        iconUrl = "sap-icon://excel-attachment";
                        break;
                    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                        iconUrl = "sap-icon://doc-attachment";
                        break;
                    case "application/pdf":
                        iconUrl = "sap-icon://pdf-attachment";
                        break;
                    default:
                        iconUrl = "sap-icon://attachment";
                }
                return iconUrl;
            }
        });
    });
