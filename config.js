const path = require('path');
const HTTP_PORT = process.env.SPIRIT_HTTP_PORT || 3000;

const MONGO_HOST = process.env.SPIRIT_MONGODB_HOST || 'localhost';
const MONGO_PORT = process.env.SPIRIT_MONGODB_PORT || 27017;
const MONGO_DB = process.env.SPIRIT_MONGODB_DB || "sio_users";
const MONGO_URL = 'mongodb://' + MONGO_HOST + ':' + MONGO_PORT + '/' + MONGO_DB;

exports.config = {
    system: {
        exposeStack: true
    },
    host: 'localhost',
    port: HTTP_PORT,
    https: false,
    certs: path.resolve(path.join(process.cwd(), '../certs')),
    store: {
        name: 'mongo-store',
        connection: {
            uri: MONGO_URL,
            options: {}
        }
    }
};