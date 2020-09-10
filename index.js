process.env.PATH = `${process.env.PATH}:${process.env.LAMBDA_TASK_ROOT}`;
const wkhtmltopdf = require("./utils/wkhtmltopdf");
const errorUtil = require("./utils/error");
const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const fs = require('fs');


exports.handler = function(event, context, callback) {
	console.log(event);
	    const wkhtmltopdfOptions = {
        pageSize : event.pagesize || 'a4',
        orientation : event.orientation || 'Landscape'
    }

    var  content = body.url;
	wkhtmltopdf(content, wkhtmltopdfOptions , function(code, signal) {
	    const response = {
            statusCode: 200,
            body: JSON.stringify({
                pdfBase64: signal.toString('base64'),
                options: body.options
            })
        };
        callback(null, response);
	});
};
