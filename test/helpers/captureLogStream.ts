import * as nodeStream from 'stream';

export function captureLogStream(
  stream: NodeJS.WritableStream,
  passThrough = false
) {
  const oldWrite = stream.write;
  let buf = '';

  stream.write = function(
    chunk: any,
    encoding?: string | Function,
    callback?: Function
  ) {
    buf += chunk.toString(); // chunk is a String or Buffer
    if (passThrough) oldWrite.apply(stream, arguments);
    return true;
  };

  return {
    unhook: function unhook() {
      stream.write = oldWrite;
    },
    captured: function() {
      return buf;
    }
  };
}
