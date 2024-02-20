const { MongoClient, ServerApiVersion } = require('mongodb')
require('dotenv').config();
var date_ob = new Date();
var day = ("0" + date_ob.getDate()).slice(-2);
var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
var year = date_ob.getFullYear();



let DATE = year + "-" + month + "-" + day;

// Replace the following with your Atlas connection string  
                                                                                                                                    
const url = "mongodb+srv://raafat:kYyKbbhBN91jkBvu@cluster0.phfg8.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

 // The database to use
 const dbName = "Alpha-Store";
                      
 async function addAppointment(personDocument) {
    try {
         await client.connect();
         console.log("Connected correctly to server");
         const db = client.db(dbName);


         const col = db.collection("appointment");                                                                                                                                                            
         const query= {date:personDocument.date};
         let data =  await col.find(query).toArray();
         let bool = true;
        console.log(personDocument.time)
         let time= personDocument.time.split(":")
         time = parseInt(time[0])*60 + parseInt(time[1])
        if(data){
            
         data.forEach((appointment) =>{
                
                let appointment_time = appointment.time.split(":");
                appointment_time = parseInt(appointment_time[0])*60 + parseInt(appointment_time[1]);
                let dt =(time-appointment_time);
                console.log("dt = ",dt)
                if( (  Math.abs(dt) >= 0) &&  (Math.abs(dt)<= 30)  ){
                 bool =false ;
             }
         })
        }
        if(bool){
            const p = await col.insertOne(personDocument);
            console.log("inserted")
            await client.close();
            return true;
        }else{
            await client.close();
            return false;
        }
        
        

        } catch (err) {
         console.log(err.stack);
     }
 
    
}
 async function getData(collectionName) {
    try {

         await client.connect();
         console.log("Connected correctly to server");
         const db = client.db(dbName);

         // Use the collection "admins/appointments"

         const col = db.collection(collectionName);                                                                                                                                                            
         
     // Find one document
        
        let query ,sort ;
        collectionName === "admins" ? query ={} : query= { date : DATE };
        collectionName === "admins" ? sort ={} : sort = { time: 1 } ;
        
         const myDoc = await col.find(query).sort(sort).toArray();
         // Print to the console
        //  console.log(myDoc);
        
         await client.close();
            return myDoc;
        } catch (err) {
         console.log(err.stack);
     }
 
  
}

async function updateDB(){
    let hours = parseInt( date_ob.getHours())*60;
    let minutes = parseInt(date_ob.getMinutes());
    const time_now = hours+minutes;
   
    try{
        await client.connect();
         console.log("Connected correctly to server for update");
         const db = client.db(dbName);


         const col = db.collection("appointment");                                                                                                                                                            
         const query= {date : DATE};
         let data =  await col.find(query).toArray();
         console.log("data = " , data)
         data.forEach( async (appointment)=>{
            let appointment_time = appointment.time.split(":");
            appointment_time = parseInt(appointment_time[0])*60 + parseInt(appointment_time[1]);

            let dt = appointment_time - time_now;
           
            if (dt < 0 ) {
                console.log(`appointment at ${DATE} ${appointment.time} has been deleted`)
                await col.deleteOne(appointment) ; 
               
            }
         })
         
    } catch (err) {
        console.log(err.stack);
    }
    finally {
        // 
        // console.log("update done")
        // await client.close();
      
        //update every one hour
        setTimeout(updateDB,3600000  );
    }
        
}

updateDB();
//   let data = {name:"סאמר",time:"10:30",dogtype:"רועה בלגי",date:"2022-10-02"}
//    addAppointment(data);
// run().catch(console.dir);
 module.exports.addAppointment= addAppointment;
 module.exports.getData= getData;