import {inspect} from 'util';
import {
  createSecureServer,
  constants,
  Http2SecureServer,
  ServerHttp2Stream,
  IncomingHttpHeaders,
} from 'http2';
import fs from 'fs';
import {resolve} from 'path';
import mime from 'mime-types';

import {errorHandler} from './utils';
import {Http2Message, Methods} from './interface';
import {deleteHandler, getHandler, postHandler, putHandler} from './router';

const {HTTP2_HEADER_PATH, HTTP2_HEADER_METHOD} = constants;

const parseStream = (
  stream: ServerHttp2Stream,
  headers: IncomingHttpHeaders,
): Promise<Http2Message> => {
  return new Promise((resolveFn, rejectFn) => {
    const data: Buffer[] = [];
    stream.on('data', (chunk: Buffer) => data.push(chunk));
    stream.on('error', (err) => {
      errorHandler(err, stream);
      rejectFn(err);
    });

    stream.on('end', () => {
      let method = headers[HTTP2_HEADER_METHOD];
      let path = headers[HTTP2_HEADER_PATH];
      if (Array.isArray(path)) {
        path = path.join('');
      }
      if (Array.isArray(method)) {
        method = method.join('');
      }
      if (path === '/') {
        path = 'index.html';
      }
      if (path?.indexOf('/') === 0) {
        path = path.substr(1);
      }

      const fullPath = resolve(__dirname, `public`, path || '');
      const mimeType = mime.lookup(fullPath);

      const buff = Buffer.concat([...data]);
      const body = buff.toString();
      resolveFn({
        method: method || 'GET',
        body,
        path: path || '',
        fullPath,
        mimeType,
      });
    });
  });
};

const requestHandler = async (stream: ServerHttp2Stream, headers: IncomingHttpHeaders) => {
  const req = await parseStream(stream, headers);
  console.log(`Request handled: ${inspect(req)}`);

  // CRUD on http2 example
  if (req.path?.indexOf('users') === 0) {
    switch (req.method) {
      case Methods.GET:
        return getHandler(stream, req.path);
      case Methods.POST:
        return postHandler(stream, req.body || '');
      case Methods.DELETE:
        return deleteHandler(stream, req.path);
      case Methods.PUT:
        return putHandler(stream, req.body || '', req.path);
      default:
        stream.respond({':status': 404});
        return stream.end();
    }
  }
  // general static files example
  if (req.path === 'index.html') {
    return stream.respondWithFile(
      req.fullPath,
      {'content-type': req.mimeType.toString()},
      {onError: (err: NodeJS.ErrnoException) => errorHandler(err, stream)},
    );
  }

  // http2 push example
  if (req.path === 'push.html') {
    stream.respondWithFile(
      req.fullPath,
      {'content-type': req.mimeType.toString()},
      {onError: (err: NodeJS.ErrnoException) => errorHandler(err, stream)},
    );
    return stream.pushStream(
      {':path': '/push.css'},
      {parent: stream.id},
      (err: Error, pushStream) => {
        if (err) {
          errorHandler(err, stream);
        }
        console.log('Pushing additional content...');
        pushStream.respondWithFile(
          resolve(__dirname, `public`, 'push.css'),
          {'content-type': 'text/css'},
          {onError: (err) => errorHandler(err, stream)},
        );
      },
    );
  }

  // page not found
  stream.respond({':status': 404});
  stream.end();
};

export const createServer = (): Http2SecureServer => {
  const options = {
    key: fs.readFileSync(resolve(__dirname, './tls/key.key')),
    cert: fs.readFileSync(resolve(__dirname, './tls/cert.crt')),
  };
  const server = createSecureServer(options);
  server.on('stream', requestHandler);
  server.on('connect', (ev: any) => console.log(`Client connected: ${inspect(ev)}`));
  server.on('close', (ev: any) => console.log(`Client closed: ${inspect(ev)}`));
  server.on('ping', (ev: any) => console.log(`Client ping: ${inspect(ev)}`));

  return server;
};
