const { default: makeWASocket, DisconnectReason } = require("@whiskeysockets/baileys");

async function startBot() {
    const sock = makeWASocket({
        printQRInTerminal: true
    });

    sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
        if (connection === "close") {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) startBot();
        } else if (connection === "open") {
            console.log("Bot is online!");
        }
    });

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;

        const from = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

        if (text === "Hi") {
            await sock.sendMessage(from, { text: "Hello! How can I help you?" });
        }
    });
}

startBot();
