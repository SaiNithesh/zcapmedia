using { nithesh.capmedia as md } from '../db/schema';

@path: '/mediapath'
service MediaService {
    entity Attachments as projection on md.Attachments;
}