import db = require('../lib/base');
import { Column, Table } from 'anydb-sql';

namespace Types {
    export function VARCHAR(length: number) { return `VARCHAR(${length})`; }
    export const ID = 'INTEGER AUTO_INCREMENT';
    export const INTEGER = 'INTEGER';
    export const JSON = 'JSON';
}

namespace Names {
    export const User = 'User';
}

export interface User {
    id: number;
    username: string;
    password: string;
    embg: string;
    pollVotes: object | string
}

interface UserTable extends Table<User> {
    id: Column<number>;
    username: Column<string>;
    password: Column<string>;
    embg: Column<string>;
    pollVotes: Column<object | string>;
}

export const User = <UserTable>db.define<User>({
    name: Names.User,
    columns: {
        id: { primaryKey: true, dataType: Types.ID },
        username: { notNull: true, dataType: Types.VARCHAR(20) },
        password: { notNull: true, dataType: Types.VARCHAR(100) },
        embg: { notNull: true, dataType: Types.VARCHAR(13) },
        pollVotes: { notNull: true, dataType: Types.JSON }
    }
});
