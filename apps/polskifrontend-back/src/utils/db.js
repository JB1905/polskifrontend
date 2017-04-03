import mongoose from 'mongoose';
import log from 'log';
import config from '../config';

const { host, database, user, password, port } = config.mongodb;
let status = 'DISCONNETED';

const init = () => {
  if (status === 'DISCONNETED') {
    let mongoUrl = `mongodb://${host}/${database}`;
    if (user && password && port) {
      mongoUrl = `mongodb://${user}:${password}@${host}:${port}/${database}`;
    }
    mongoose.connect(mongoUrl);
    status = 'CONNECTING';
    const db = mongoose.connection;
    return new Promise((resolve, reject) => {
      db.on('error', err => {
        status = 'DISCONNETED';
        log.error(err);
        reject(err);
      });
      db.once('open', () => {
        status = 'CONNECTED';
        log.info('Database connected');
        resolve();
      });
    });
  }
};

export default { init };
