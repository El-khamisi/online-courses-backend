const nodemailer = require("nodemailer");


async function main() {

  
  let transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: 'depaxmail@gmail.com',
      pass: 'dkbbrmiszgyasbwp'
    }
 });

  
  let info = await transport.sendMail({
    to: 'mohammd.alkhamisi@gmail.com',
    subject: 'Hello ✔',
    text: 'Hello world?', 
    html: '<b>Hello world?</b>',
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

main().catch(console.error);
