// eslint-disable-next-line
const AWS = require('aws-sdk')
AWS.config.region = process.env.AWS_REGION
const s3 = new AWS.S3()

exports.handler = function(event, context) {
  console.log('Received S3 event:', JSON.stringify(event, null, 2));
  // Get the object from the event and show its content type
  const bucket = event.Records[0].s3.bucket.name; //eslint-disable-line
  const key = event.Records[0].s3.object.key; //eslint-disable-line
  console.log(`Bucket: ${bucket}`, `Key: ${key}`);

  const parts = key.split("/")
  const newKey = parts[parts.length-1]

  const params = {
    Bucket: `${bucket}-temp`, 
    CopySource: `/${bucket}/${key}`, 
    Key: newKey
   };

   s3.copyObject(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
        else console.log(data); 
     context.done(null, 'End')
   })

};
