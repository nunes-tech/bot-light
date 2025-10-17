const { default: nodeCron } = require("node-cron");
const saveError = require("./save_errors");

// Armazena tarefas por grupo
const agendamentos = {};

async function scheduleGP(client, msg) {
  try {
    const [rawCommand, rawTime] = msg.body.trim().split(" ");
    if (!rawTime) return msg.resp("⚠️ Informe o horário. Ex: !abrirgp 05:30");

    const command = rawCommand.substring(1).toLowerCase();
    const [hourStr, minuteStr] = rawTime.trim().split(":");
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    if (isNaN(hour) || isNaN(minute)) {
      return msg.resp("❌ Horário inválido. Use o formato HH:MM");
    }

    const chatGroup = await client.getChatById(msg.from);
    if (!chatGroup || !chatGroup.isGroup) {
      return msg.resp("❌ Use este comando em um grupo.");
    }

    // Inicializa registro do grupo se não existir
    if (!agendamentos[msg.from]) agendamentos[msg.from] = { abrir: null, fechar: null };

    // Cancela agendamento anterior (corrigido)
    if (command === "abrirgp" && agendamentos[msg.from].abrir) {
      agendamentos[msg.from].abrir.job.stop();
    }
    if (command === "fechargp" && agendamentos[msg.from].fechar) {
      agendamentos[msg.from].fechar.job.stop();
    }

    // Cria novo agendamento
    const job = nodeCron.schedule(`${minute} ${hour} * * *`, async () => {
      try {
        if (command === "fechargp") {
          const res = await chatGroup.setMessagesAdminsOnly(true);
          msg.resp(res ? "🔒 Grupo fechado automaticamente!" : "⚠️ Falha ao fechar o grupo.");
        } else if (command === "abrirgp") {
          const res = await chatGroup.setMessagesAdminsOnly(false);
          msg.resp(res ? "🔓 Grupo aberto automaticamente!" : "⚠️ Falha ao abrir o grupo.");
        }
      } catch (err) {
        saveError(`[scheduleGroup.js] Erro no cron (${command}): ${err.message}`);
      }
    }, { timezone: "America/Sao_Paulo" });

    // Armazena o novo job + metadados
    const horario = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    if (command === "abrirgp") {
      agendamentos[msg.from].abrir = { job, horario };
    } else if (command === "fechargp") {
      agendamentos[msg.from].fechar = { job, horario };
    }

    msg.resp(`⏰ Agendamento definido: ${command === "fechargp" ? "fechar" : "abrir"} o grupo todos os dias às ${horario}`);

  } catch (error) {
    console.error("[scheduleGroup.js] Erro ao agendar grupo:", error);
    saveError(`[scheduleGroup.js] Falha ao agendar: ${error.message}`);
    msg.resp("⚠️ Ocorreu um erro ao tentar agendar o comando.");
  }
}

async function getSchedulesGPS(client) {
  if (Object.keys(agendamentos).length === 0) {
    return "❌ Nenhum agendamento encontrado.";
  }

  let resultado = '*Agendamentos:*\n';
  for await (const [groupId, { abrir, fechar }] of Object.entries(agendamentos)) {
    const grupo = await client.getChatById(groupId);
    resultado += `${grupo.name}:\nabrir: ${abrir ? abrir.horario : null}\nfechar: ${fechar ? fechar.horario : null}\n\n`;
  }

  return resultado;
}

module.exports = { scheduleGP, getSchedulesGPS };