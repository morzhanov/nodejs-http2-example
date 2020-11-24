export enum Methods {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PUT = 'PUT',
}

export interface Http2Message {
  path: string;
  body?: string;
  fullPath: string;
  method: string;
  mimeType: string | false;
}

export interface User {
  id: string;
  name: string;
}
