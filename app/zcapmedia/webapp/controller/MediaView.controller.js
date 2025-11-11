sap.ui.define([
   "./BaseController",
  "sap/m/MessageToast",
  "sap/m/PDFViewer",
  "sap/ui/model/json/JSONModel",
      "sap/base/Log"
], function (BaseController, MessageToast, PDFViewer, JSONModel, Log) {
  "use strict";

  return BaseController.extend("zcapmedia.controller.MediaView", {
    onInit: function () {
      this._selectedFile = null;
    },
    onAfterRendering: function () {
        this._loadAttachments();
    },

    onFileSelected: function (oEvent) {
      const oFileUploader = oEvent.getSource();
      const aFiles = oEvent.getParameter("files");
      if (aFiles && aFiles.length > 0) {
        this._selectedFile = aFiles[0];
        MessageToast.show("File selected: " + this._selectedFile.name);
      }
    },
    _loadAttachments: async function () {
        let that = this;
        try {
            const response = await fetch("/mediapath/Attachments", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            });

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                let erObj = {
                    "resStatus": response.status,
                    "resMsg": errorBody.error.message,
                    "details": errorBody?.error?.details,
                    "target": errorBody?.error?.target
                }
                throw erObj;
            } else {
                that._setAppBusy(false);
                const succBody = await response.json().catch(() => ({}));
                Log.info("Success: ", succBody);
            }
        }
        catch (error) {
            that._setAppBusy(false);
            Log.error("Error while : ", JSON.stringify(error));
            that._displayErrorMsgDialog(error.resMsg)
        }
    },
    onUploadToCAP: function () {if (!this._selectedFile) {
        MessageToast.show("Please select a file first.");
        return;
      }

      const oFile = this._selectedFile;
      const reader = new FileReader();

      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        const blob = new Blob([arrayBuffer], { type: "application/pdf" });

        fetch("/mediapath/Attachments", {
          method: "POST",
          body: JSON.stringify({
            mediaType: "application/pdf",
            fileName: oFile.name,
            size: oFile.size
          })
        })
        .then(res => res.json())
        .then(data => {
          const id = data.ID;
          return fetch(`/mediapath/Attachments(${id})/content`, {
            method: "PUT",
            headers: { "Content-Type": "application/pdf" },
            body: blob
          });
        })
        .then(() => {
          MessageToast.show("Upload successful!");
          this._loadAttachments();
        })
        .catch(err => {
          console.error(err);
          MessageToast.show("Upload failed.");
        });
      };

      reader.readAsArrayBuffer(oFile);
    },

    onViewPDF: function () {
      const attachmentId = "beed28f9-dac9-421e-8af0-35bcf210a04d"; // Replace with actual ID
      const pdfUrl = `/mediapath/Attachments(${attachmentId})/content`;

      const oViewer = new PDFViewer({
        source: pdfUrl,
        title: "PDF Preview"
      });

      oViewer.open();
    }
  });
});
