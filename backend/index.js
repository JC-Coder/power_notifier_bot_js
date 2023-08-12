const session = require("telegraf/session");
const express = require("express");
const { Telegraf } = require("telegraf");
const { token, serverUrl, PORT, admin } = require("./data");
const app = express();
const Scene = require("telegraf/scenes/base");
const Stage = require("telegraf/stage");
const stage = new Stage();
const Markup = require("telegraf/markup");
const cron = require("node-cron");
const axios = require("axios");
const cors = require("cors");

let power = false;

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors("*"));

// Create a new Telegraf bot instance
const bot = new Telegraf(token);

// Set up webhook
bot.telegram.setWebhook(`${serverUrl}/webhook/${token}`, {
  webhookPath: `/webhook/${token}`,
});

// Route handler for incoming updates
app.post(`/webhook/${token}`, (req, res) => {
  const update = req.body;
  bot.handleUpdate(update);
  res.sendStatus(200);
});

app.get("*", async (req, res) => {
  try {
    res.status(200).send("Bot running");
  } catch (e) {
    console.log(e.message);
  }
});

app.post("/charge", async (req, res) => {
  try {
    const { isCharging } = req.body;

    if (Object.keys(req.body).length <= 0) {
      return res.status(400).json({
        success: false,
        message: "invalid input",
      });
    }

    if (isCharging) {
      bot.telegram.sendMessage(
        admin,
        `⚡️ JC! Light don show face again! Shine ya eye! 💡😄`
      );
    } else {
      bot.telegram.sendMessage(
        admin,
        `❌ Chai! Light don off, but no wahala. Abeg, chill small! 🔋🙆‍♂️`
      );
    }

    power = isCharging;

    return res.status(200).json({
      success: true,
      message: "success",
    });
  } catch (e) {
    console.log("error", e);
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
});

// middleware
bot.use(session());
bot.use(stage.middleware());

bot.start(async (ctx) => {
  try {
    const userId = ctx.update.message.from.id;

    return await ctx.replyWithHTML("🙃 Hello boss JC.", {
      reply_markup: {
        remove_keyboard: true,
      },
    });
  } catch (e) {
    console.log(e.message);
  }
});

bot.on("text", async (ctx) => {
  try {
    const userId = ctx.update.message.from.id;
    const text = ctx.update.message.text;

    if (userId == admin) {
      if (
        text.toLowerCase() == "is there light" ||
        text.toLowerCase() == "is there power supply"
      ) {
        await ctx.replyWithHTML(`..............`);
        await ctx.replyWithHTML(`checking power status`);
        await ctx.replyWithHTML(`retrieving power status`);

        if (power) {
          return await ctx.replyWithHTML(`There is power supply💡😄`);
        } else {
          return await ctx.replyWithHTML(`Ops, there is no power supply`);
        }
      }
    }

    return ctx.replyWithHTML(`i don't understand ..`);
  } catch (e) {
    console.log(e.message);
  }
});

// cron to keep server online (runs every 5 minutes)
cron.schedule("*/10 * * * *", () => {
  try {
    console.log("cron running for server");
    axios.get(serverUrl);
  } catch (e) {
    console.log(e.message);
  }
});

// Start the Express.js server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
