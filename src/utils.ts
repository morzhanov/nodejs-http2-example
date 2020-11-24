import {ServerHttp2Stream, constants} from 'http2';
import {inspect} from 'util';

const {HTTP_STATUS_NOT_FOUND, HTTP_STATUS_INTERNAL_SERVER_ERROR} = constants;

export const errorHandler = (err: NodeJS.ErrnoException, stream: ServerHttp2Stream): void => {
  console.log(`An error occurred: ${inspect(err)}`);
  if (err.code === 'ENOENT') {
    stream.respond({':status': HTTP_STATUS_NOT_FOUND});
  } else {
    stream.respond({':status': HTTP_STATUS_INTERNAL_SERVER_ERROR});
  }
  stream.end();
};
