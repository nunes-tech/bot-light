const saveError = require('../utils/save_errors');
const { scheduleGP, getSchedulesGPS } = require('../utils/scheduleGroup');

class MainMiddleware {

    constructor(client, msg) {
        this.client = client,
        this.msg = msg;
        this.start();
    };

    async start() {
        try {
            if (this.msg.body === '!test') {
                //msg.resp( msg.showMsg() );
                if(await this.msg.isOwner()) {
                    this.msg.resp('Sim é dono');
                } else this.msg.resp('Não é dono');
            }

            if (this.msg.body === '!ping') {
                this.msg.resp('pong');
            }
            
            if (this.msg.body.startsWith('!abrirgp')) {
                await scheduleGP(this.client, this.msg);
            }

            if (this.msg.body.startsWith('!fechargp')) {
                await scheduleGP(this.client, this.msg);
            }

            if (this.msg.body.startsWith('!agendamentos')) {
                const agendamentos = await getSchedulesGPS(this.client);
                this.msg.resp(agendamentos);
            }

        } catch (error) {
            saveError('[Erro na start do MainMiddleware.js]: ', error);
            console.log('Erro na start do MainMiddleware.js', error);
        }
    }

};

module.exports = MainMiddleware;