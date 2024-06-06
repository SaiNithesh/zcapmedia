namespace nithesh.capmedia;

using {
    cuid,
    managed
} from '@sap/cds/common';

entity Attachments: cuid, managed{
    @Core.MediaType: mediaType 
    @Core.ContentDisposition.Filename: fileName 
    @Core.ContentDisposition.Type: 'inline'
    content: LargeBinary;
    @Core.IsMediaType: true
    mediaType: String;
    fileName: String;
    size: Integer;
    url: String;
}