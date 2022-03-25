require('dotenv').config();

module.exports = {
    // MONGO_URL: 'mongodb+srv://chihanchou:chihanchou@cluster0.r32ha.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    MONGO_URL: 'mongodb+srv://chihanchou:chihanchou@cluster0.m5wtt.mongodb.net/testDB?retryWrites=true&w=majority',
    SECRET_KEY: 'This is the encryption key.',
    s3: {
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
        },
        region: process.env.AWS_S3_REGION,
        params: {
            ACL: 'public-read',
            Bucket: process.env.AWS_S3_BUCKET,
        },
    },
}