const API_KEY = process.env.SENDEMAIL_API_KEY;
const DOMAIN = process.env.SENDEMAIL_DOMAIN_NAME;

 const formData =  require ('form-data');
 const Mailgun = require('mailgun.js') ;

 const mailgun = new Mailgun(formData);
 const client = mailgun.client({username: 'api', key: API_KEY});

const sendWelcomeEmail = (email, name)=>{
    
    const messageData = {
        from: email,
        to: 'learnroh1@gmail.com',
        subject: 'Thanks for joining',
        text: `Welcome to the application ${name}. Let me know how you get aling with the app.`
      };
      
      client.messages.create(DOMAIN, messageData)
       .then((res) => {
         console.log(res);
       })
       .catch((err) => {
         console.error(err);
       });
}

const sendCancelEmail = (email, name) =>{
    const messageData = {
        from: email,
        to: 'learnroh1@gmail.com',
        subject: 'Account removal',
        text: `We respect your decision to leave us, but ${name} is there anything we can do better which would make you stay.`
      };
      
      client.messages.create(DOMAIN, messageData)
       .then((res) => {
         console.log(res);
       })
       .catch((err) => {
         console.error(err);
       });
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}