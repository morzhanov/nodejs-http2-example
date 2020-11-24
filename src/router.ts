import {ServerHttp2Stream} from 'http2';

import {add, findAll, findOne, remove, update} from './db';
import {errorHandler} from './utils';

const parseBody = (body: string): any => {
  try {
    return JSON.parse(body);
  } catch (err: any) {
    console.log(`Error during JSON body parsing: ${err.message}`);
  }
};

export const postHandler = async (
  stream: ServerHttp2Stream,
  bodyContent: string,
): Promise<void> => {
  const body = parseBody(bodyContent);
  if (!body) {
    return errorHandler(new Error('Empty or not valid body'), stream);
  }

  try {
    await add(body);
  } catch (err: any) {
    return errorHandler(err, stream);
  }

  stream.respond({':status': 201});
  stream.end();
};

export const getHandler = async (stream: ServerHttp2Stream, path: string): Promise<void> => {
  if (path === '/users') {
    getAllHandler(stream);
  } else {
    getOneHandler(stream, path);
  }
};

const getAllHandler = async (stream: ServerHttp2Stream): Promise<void> => {
  try {
    const res = await findAll();
    const json = JSON.stringify(res);
    stream.respond({':status': 200});
    stream.end(json);
  } catch (err: any) {
    return errorHandler(err, stream);
  }
};

const getOneHandler = async (stream: ServerHttp2Stream, path: string): Promise<void> => {
  try {
    const id = path.substr(7);
    const res = await findOne(id);
    const json = JSON.stringify(res);
    stream.respond({':status': 200});
    stream.end(json);
  } catch (err: any) {
    return errorHandler(err, stream);
  }
};

export const deleteHandler = async (stream: ServerHttp2Stream, path: string): Promise<void> => {
  try {
    const id = path.substr(7);
    await remove(id);
    stream.respond({':status': 200});
    stream.end();
  } catch (err: any) {
    return errorHandler(err, stream);
  }
};

export const putHandler = async (
  stream: ServerHttp2Stream,
  bodyContent: string,
  path: string,
): Promise<void> => {
  const body = parseBody(bodyContent);
  if (!body) {
    return errorHandler(new Error('Empty or not valid body'), stream);
  }

  try {
    const id = path.substr(7);
    await update(id, body);
    stream.respond({':status': 200});
    stream.end();
  } catch (err: any) {
    return errorHandler(err, stream);
  }
};
