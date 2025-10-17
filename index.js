const { LocalAuth } = require("whatsapp-web.js");
const qrcode = require('qrcode-terminal');
const saveError = require("./utils/save_errors");
const CustomClient = require("./custom/CustomClient");
const { messageExtras } = require("./extensions");
const MainMiddleware = require("./middleware/MainMiddleware");

(async () => { // ← você esqueceu os parênteses aqui no seu código original
    try {
        const client = new CustomClient({
            authStrategy: new LocalAuth({ clientId: 'client1' }),
            puppeteer: {
                args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-accelerated-2d-canvas',
                        '--no-first-run',
                        '--no-zygote',
                        '--disable-gpu'
                        ],
                headless: true,
            },
        });

        client.on('qr', qr => {
            console.log('Escaneie o QR Code abaixo com o WhatsApp:');
            qrcode.generate(qr, { small: true });
        });

        client.on('ready', async () => {
            console.log('Bot conectado e pronto!');
        });

        client.on('auth_failure', async msg => {
            console.error('Falha de autenticação:', msg);
        });

        client.on('disconnected', async (reason) => {
            console.log('Cliente desconectado:', reason);
            try {
                await client.destroy();
            } catch (e) {}
            process.exit(1);
        });

        client.on('message', async msg => {

            //adiciona novas funções em msg
            Object.assign(msg, messageExtras);

            if(msg.isCommandValid() && await msg.isOwner()) {
                new MainMiddleware(client, msg);
            };
        
        });

        await client.initialize();

    } catch (err) {
        console.error("Erro geral:", err);
        saveError(`[index.js -> erro aqui: ]`,err.message);
    }
})();