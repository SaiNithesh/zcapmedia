const cds = require('@sap/cds')

module.exports = async function () {
    this.before('CREATE', 'Attachments', req => {
        console.log('Create called')
        console.log(JSON.stringify(req.data))
        req.data.url = `/odata/v4/mediapath/Attachments(${req.data.ID})/content`
    })

    this.before('READ', 'Attachments', req => {
        //check content-type
        console.log('content-type: ', req.headers['content-type'])
    })
}