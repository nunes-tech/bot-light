const fs = require('fs');
const { PATH_MAIN } = require('../config');
const { sep } = require('path');

function saveError(err) {
    try {
        const path_log_error = `${PATH_MAIN}logs${sep}errors.log`;
        if(!fs.existsSync(path_log_error)){
            fs.writeFileSync(path_log_error, '');
        };

        fs.writeFileSync(path_log_error, JSON.stringify(err, null, 2));
        return true;
    } catch (error) {
        console.log(`erro ao salvar errors: ${error.message}`);
        return false;
    };
};

module.exports = saveError;