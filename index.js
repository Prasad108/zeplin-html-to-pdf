process.env.PATH = `${process.env.PATH}:${process.env.LAMBDA_TASK_ROOT}`;
const wkhtmltopdf = require("./utils/wkhtmltopdf");
const errorUtil = require("./utils/error");
const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const fs = require('fs');

exports.handler = function handler(event, context, callback) {
    if (!event.html) {
        const errorResponse = errorUtil.createErrorResponse(400, "Validation error: Missing field 'html'.");
        callback(errorResponse);
        return;
    }
    
    const filename = `${(event.filename || Math.random().toString(36).slice(2))}.pdf`;
    const pageSize = event.pagesize || 'a4';
    const data = event.data;
    
    
    const output = `/tmp/${filename}`;
    const writeStream = fs.createWriteStream(output);

    wkhtmltopdf(event.html)
        .then(buffer => {
        console.log("converted the html to PDF");
        S3.putObject({
            Bucket: 'html-to-pdf-test-1',
            Key: filename,
            Body: buffer.read(),
            ContentType: 'application/pdf',
        }, (error) => {
            if (error != null) {
                console.log({ error })
                console.error('Unable to send file to S3');
               // callback('Unable to send file to S3', {});
            } else {
                console.log({ filename })
                    console.info('Upload done!');
               // callback(null, { filename });
            }
        });
        
            callback(null, {
                data: buffer.toString("base64")
            });
        }).catch(error => {
            callback(errorUtil.createErrorResponse(500, "Internal server error", error));
        });
};
