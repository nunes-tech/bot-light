require('dotenv').config();
const path = require('path');

const PATH_MAIN = path.join(__dirname, path.sep, '..', path.sep);

const ownerMain = process.env.owner_number_main;
const owner2 = process.env.owner_number_2 ?? '';
const owner3 = process.env.owner_number_3 ?? '';

const _owners = [ownerMain, owner2, owner3];
const owners = _owners.filter(it => it !== '');

console.log( owners );

module.exports = {
    PATH_MAIN,
    owners
};