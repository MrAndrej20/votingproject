import anydbSQL = require('anydb-sql');
import config = require('../config');

namespace db {
    export type Transaction = anydbSQL.Transaction;
}

const db = anydbSQL(config.mysql);
export = db;
