const {Client}= require("discord.js");
const client = new Client();
const prefix = "!";
const nodemailer = require("nodemailer");
var spamming;

var cooldown = new Set();

// REQUIRED (used to log in into your email address)
var login = {
    mail: "gmailhere@gmail.com",
    pass: "password here"
}
var token = ""; // YOUR TOKEN

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: { user: login.mail, pass: login.pass },
});
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  spamming = false;
  console.log("Spam Bot is ready.");
});


client.on("message", async (msg) => {
  if(msg.author.bot) return;
  var args = msg.content.split(" ").slice(1);
  var customArgs = args.join(" ").split("\"")
  var command = msg.content.toLowerCase().slice(prefix.length).split(" ")[0];
  if (msg.author.bot) return;
  if (command === "send") {
    if(cooldown.has(msg.author.id)) return msg.reply("You can only call this command once in 5 minutes.");
    if (!args[0]) return msg.reply("You need to insert a mail target!");
    if(!customArgs[1]) return msg.reply("You need to insert a mail text!");
    if(!customArgs[2].trim()) return msg.reply("You need to insert how many times the email should be sent!");

    if(isNaN(parseInt(customArgs[2]))) return msg.reply("You need to insert how many times the email should be sent! (in numbers)");

    if(parseInt(customArgs[2].trim()) > 60) return msg.reply("You can only send ~60 messages at once!");



    function randomLetters(length) {
      var text = "";
      var possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      return text;
    }

    var mailto = args[0];
    var mailtxt = customArgs[1];
    var textinEmail = customArgs[1];

    async function sendMail(pos, message) {
      if (pos > parseInt(customArgs[2] - 1)){

          spamming = false;
        message.edit({
            embed: {
                color: 3447003,
                author: { name: client.user.username, icon_url: client.user.avatarURL },
                title: `Sent ${customArgs[2].trim()} emails`,
                description: "Sending completed",
                fields: [{ name: "Target Mail", value: mailto }],
                timestamp: new Date(),
                footer: { icon_url: client.user.avatarURL, text: "Your Truly Xeno" },
            }
        });
    } else {

      let mailOptions = {
        from: '"!!!!!" <e@gmail.com>',
        to: mailto,
        subject: randomLetters(8),
        text: textinEmail,
        html: "<b>" + mailtxt + "</b>",
      };

        await transporter.sendMail(mailOptions);
        setTimeout(() => {
            sendMail(pos + 1, message);
        }, 20);
      }
    };

    await msg.channel.send({
        embed: {
          color: 3447003,
          author: { name: client.user.username, icon_url: client.user.avatarURL },
          title: `Sending ${customArgs[2].trim()} emails`,
          description: "Sending in progress...",
          fields: [{ name: "Target Mail", value: mailto }],
          timestamp: new Date(),
          footer: { icon_url: client.user.avatarURL, text: "Your Truly Xeno" },
        }
      }).then(message => {
        sendMail(0, message)
        cooldown.add(msg.author.id);

        setTimeout(() => {
            cooldown.delete(msg.author.id);
        }, 60);

    });
    spamming = true;

  }

  if (command === "info") {
    msg.channel.send({
      embed: {
        color: 3447003,
        author: { name: client.user.username, icon_url: client.user.avatarURL },
        title: "Info",
        fields: [
          { name: "Command Sytax", value: "!send email@email.pw [something] [number]" },
        ],
        timestamp: new Date(),
        footer: { icon_url: client.user.avatarURL, text: "Your Truly Xeno" },
      }
    });
  }
});

client.login("Add Your Bot Token Here");
