import process from 'process'
import { readFileSync } from "fs";
import path from 'path';
import { logger } from '../utils/logger.js'
const currentPath = process.cwd()
export const readKeyFromFile = (fileName) => {
  return readFileSync(path.join(currentPath, `/src/keys/${fileName}`), { encoding: 'utf8', flag: 'r' }, function (err, data) {
    if (err) {
      return logger.error(err);
    }
    return data.replace("+", "");
  })
}