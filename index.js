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

    var  content = event.url;
	wkhtmltopdf(content, wkhtmltopdfOptions ).then(buffer => {
            callback(null, {
                data: "success"
            });
        }).catch(error => {
            callback(errorUtil.createErrorResponse(500, "Internal server error", error));
        });
