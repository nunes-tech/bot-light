const { owners } = require("../config");
const saveError = require("../utils/save_errors");

const messageExtras = {

    resp(text) {
        try {
            return this.reply(`🤖 ${text}`);
        } catch (error) {
            console.log('erro na função responder resp');
            saveError(`Erro no index.js -> ${error.message}`);
        }
    },

    showMsg() {
        return JSON.stringify(this, null, 2);
    },

    isGroup() {
        return this.from.endsWith('@g.us');
    },

    async isOwner() {
        try {
            if(this.isGroup()) {
                const contact = await this.getContact();
                return owners.includes(contact.id._serialized);
            }

            return owners.includes(this.from);

        } catch (error) {
            console.log('erro na função isOwner');
            saveError(`Erro na função isOwner -> ${error.message}`);
            return false;
        }
    },

    getCommand() {
        const match = this.body.trim().match(/^!(\S+)/);
        return match ? match[1] : null;
    },

    isCommandValid() {
        const command = this.getCommand();
        return command !== null && command.length > 3;
    },


    
};

module.exports = {
    messageExtras
}