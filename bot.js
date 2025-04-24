const { Telegraf } = require("telegraf");
const mysql = require("mysql2");

// Tokenni o'zinki bilan almashtir
const bot = new Telegraf("8007544404:AAFiiMRgx8cLRfd22S4l39m9XMqNXFfsY2E");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// /start komandasi
bot.start(async (ctx) => {
  const userId = ctx.from.id;
  const firstName = ctx.from.first_name;
  const username = ctx.from.username || "";

  try {
    // Foydalanuvchi bazada bormi?
    const [rows] = await pool
      .promise()
      .query("SELECT * FROM users WHERE user_id = ?", [userId]);

    if (rows.length === 0) {
      // Yo'q bo‘lsa, qo‘shamiz
      await pool
        .promise()
        .query(
          "INSERT INTO users (user_id, first_name, username) VALUES (?, ?, ?)",
          [userId, firstName, username]
        );
    }

    ctx.reply(
      `Salom, ${firstName}! \nSizning ID: ${userId} \nUsername: @${username}`
    );
  } catch (err) {
    console.error(err);
    ctx.reply("Xatolik yuz berdi!!!");
  }
});

bot.on("text", async (ctx) => {
  const userId = ctx.from.id;
  const firstName = ctx.from.first_name;
  const username = ctx.from.username || "";

  const replyMessage = `
ID: ${userId}
Ism: ${firstName}
Username: @${username}
  `;
  ctx.reply(replyMessage);
});

// Botni ishga tushirish
bot.launch().then(() => {
  console.log("Bot ishga tushdi!");
});
