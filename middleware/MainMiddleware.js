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
            const command = this.msg.getCommand();

            switch(command) {
                case 'test':
                    this.msg.resp( this.msg.getCommand() );
                break;

                case 'ping':
                    this.msg.resp('pong');
                break;

                case 'agendamentos':
                    const agendamentos = await getSchedulesGPS(this.client);
                    this.msg.resp(agendamentos);
                break;

                case 'abrirgp':
                case 'fechargp':
                    await scheduleGP(this.client, this.msg);
                break;

            };

        } catch (error) {
            saveError('[Erro na start do MainMiddleware.js]: ', error);
            console.log('Erro na start do MainMiddleware.js', error);
        }
    }

};

module.exports = MainMiddleware;