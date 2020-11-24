import {createDb} from './db';
import {createServer} from './server';

// TODO: create http2 server with static files: https://dexecure.com/blog/how-to-create-http2-static-file-server-nodejs-with-examples/
// TODO: try server push: https://dexecure.com/blog/how-to-create-http2-static-file-server-nodejs-with-examples/
// TODO: if possible try to create REST on HTTP2 using router and db
// TODO: add crud links in readme for tests
// INFO: one mor example if needed: https://github.com/molnarg/node-http2/blob/master/example/client.js

createDb();
createServer().listen(8443, () => console.log('Server started on port 8443'));
