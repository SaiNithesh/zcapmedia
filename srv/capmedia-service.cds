using { nithesh.capmedia as md } from '../db/data-model';

@path: '/odata/v4/mediapath'
service MediaService {
    entity Attachments as projection on md.Attachments
}