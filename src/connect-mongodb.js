// To use MongoDB
var http = require('http')
var MongoClient = require('mongodb').MongoClient
var Promise = require('es6-promise').Promise

const connectAndFindDoc = (query_type, query) => {
    return new Promise((resolve, reject) => {
                       
    // Connecting to MongoDB
    MongoClient.connect(
        "mongodb://haru_recast:haru_recast@ds127963.mlab.com:27963/theavengers",
        function(err, db) {
            if (err) { console.log('MongoClient.connect error', err)
                        reject(err) }
            
            // Find: find a Document of the 'query' hero
            if (query_type == 'find') {
                var cursor = db.collection("TheAvengers").find(query)
                cursor.toArray((err, result) => {
                    if (err) { console.log('collection.find() error', err)
                               reject(err) }
                           
                    if (result.length > 0) {
                        db.close()
                        resolve(result[0])
                    }
                })
            }
            // Hero_names: return all hero names in an array
            else if (query_type == 'hero_names'){
                var hero_names = []
                db.collection("TheAvengers").find().toArray(function(err,docs){
                    if (err) { console.log('collection.find() error', err)
                                reject(err) }
                                
                    // Getting heros' names from docs which include everything (= array of dicts)
                    docs.forEach(function(doc) {
                        hero_names.push(doc['hero_name'])
                    })
                    db.close()
                    resolve(hero_names)
                })
            }

        })
    })
}


var client = http.createClient(80, "facebook.com");
request = client.request();
request.on('response', function( res ) {
           res.on('data', function( data ) {
                  console.log( data.toString() );
                  } );
           } );
request.end();

//connectAndFindDoc('find', {hero_name: "Hulk"}).then(console.log, console.error)
//connectAndFindDoc('hero_names', "").then(console.log, console.error)
module.exports = connectAndFindDoc
