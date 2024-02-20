const Vonage = require('@vonage/server-sdk')
require('dotenv').config();

const vonage = new Vonage({
  apiKey:  process.env.apiKey ,
  apiSecret: process.env.apiSecret
})

function sendSMS(data){
const from = "Alpha Store"
const to = `972${data.phoneNumber}`
const text = "boker tov benzo , wenak?" 
// ${data.name}\nנקבע לך תור בתאריך ${data.data} בשעה ${data.time}`

vonage.message.sendSms(from, to, text, (err, responseData) => {
    if (err) {
        console.log(err);
    } else {
        if(responseData.messages[0]['status'] === "0") {
            console.log("Message sent successfully.");
        } else {
            console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
        }
    }
})
}

// const man = {
//     name:" ראפת מרזוק",phoneNumber:"587473826",time:"09:39",date:"2022-10-11",dogtype:"הסקי"
// }
// // sendSMS(man)