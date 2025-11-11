const cds = require('@sap/cds');
const LCAPApplicationService = require('@sap/low-code-event-handler');
const LOG = cds.log('SERVICE_JS_LOG');

class MediaService extends LCAPApplicationService {
    init() {

        this.before('CREATE', 'Attachments', req => {
            LOG.info('Create called: ', JSON.stringify(req.data))
            req.data.url = `/mediapath/Attachments(${req.data.ID})/content`
        })

        this.on('CREATE', 'Attachments', async req => {
            LOG.info('On Create called: ', JSON.stringify(req.data))
            const { fileName, mediaType } = req.data;
            const file = req._.req?.files?.[0]; // Access uploaded file

            if (!file || !file.buffer) {
            return req.reject(400, 'No file uploaded');
            }

            const buffer = file.buffer;
            const size = buffer.length;

            const result = await srv.run(INSERT.into(Attachments).entries({
            fileName,
            mediaType,
            size,
            content: buffer
            }));

            return result;
        })

        this.before('READ', 'Attachments', req => {
            //check content-type
            LOG.info('content-type: ', req.headers['content-type'])
        })

        return super.init()
    }
}

module.exports = {
    MediaService
}