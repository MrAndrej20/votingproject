import Bluebird = require("bluebird");
const entities = require("../entities/all");
import { Transaction, Table } from "anydb-sql";


function getModels(): Table<any>[] {
    return Object.keys(entities).map(modelName => entities[modelName]).filter(table => {
        return (typeof table.create === "function") && (typeof table.drop === "function");
    });
}

export function up(tx: Transaction) {
    return Bluebird.map(getModels(), table => table.create().ifNotExists().execWithin(tx));
}

export function down(tx: Transaction) {
    return Bluebird.map(getModels(), table => table.drop().ifExists().execWithin(tx));
}
