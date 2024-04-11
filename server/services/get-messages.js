const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'local',
    user: 'root',
    password: '',
    database: 'realtime_chat'
});

function getMessages (room){
    if(room === '') return null;
    console.log(`the room is ${room}`);
    

    const sqlMessages = 'SELECT * FROM messages WHERE room = ? LIMIT 100';

    // con.query(sqlMessages, (error, results, fields) => {
    //     if(error) throw error;

        
    // });
    return new Promise((resolve, reject) => {
        con.connect( (error) => {
            if(error){
                reject(error);
                return;
            }
        });
        // con.query(sqlMessages, [room], (error, results) => {
        //     if(error){
        //         reject(error);
        //     } else{
        //         resolve(results);
        //     }
        // });
        con.query(sqlMessages, [room], (error, results) => {
            con.end();

            if(error){
                reject(error);
            } else{
                resolve(results);
            }
        });
    });

}

module.exports = getMessages;