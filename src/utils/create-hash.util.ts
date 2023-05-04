import { server } from '../dependencies/index.dependencies';

const crypto = server.crypto;

export function createHash(string: string) {
  return crypto.createHash('md5').update(string).digest('hex');
}
