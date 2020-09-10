process.env.PATH = `${process.env.PATH}:${process.env.LAMBDA_TASK_ROOT}`;
const wkhtmltopdf = require("./utils/wkhtmltopdf");
const errorUtil = require("./utils/error");
const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const fs = require('fs');
createWriteStream = require('fs').createWriteStream;


exports.handler = function(event, context, callback) {
	console.log(event);
	const wkhtmltopdfOptions = {
        pageSize : event.pagesize || 'a4',
        orientation : event.orientation || 'Landscape'
    }
	
	

    var  content = event.url;
	const pageSize = event.pagesize || 'a4';
	
	wkhtmltopdf(event.html, {pageSize},() => {
	 console.log("converted the html to PDF");
		callback(null, "success");
	},(error) => {
            if (error != null) {
               console.error('wkhtmltopdf failed!');
            } else {
                console.log('PDF generation was successful. Starting S3 upload...');
              callback(null, 'Success');
            }
        }).pipe(createWriteStream);
}
