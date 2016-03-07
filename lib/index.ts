import * as _util from './util';
import { Node } from './classes/Node';
import { Subject } from './classes/Subject';
import { Resource } from './classes/Resource';
import { Graph } from './classes/Graph';
import { MemoryRepository } from './builtins/MemoryRepository';

export { Node } from './classes/Node';
export { Subject } from './classes/Subject';
export { Graph } from './classes/Graph';
export { Resource } from './classes/Resource';
export { MemoryRepository } from './builtins/MemoryRepository';
export { Repository, Permission, Document } from './interfaces';
export const util = _util;

export default {
  util,
  Node,
  Graph,
  Subject,
  Resource,
  MemoryRepository
}
