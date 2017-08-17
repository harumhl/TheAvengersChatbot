// To use MongoDB
var http = require('http')
var MongoClient = require('mongodb').MongoClient
var Promise = require('es6-promise').Promise

const connectAndFindDoc = (query_type, query, return_type) => {
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
                        // example of 'return_type': 'ask-facts-character-name'
                        // get rid of 'ask-facts-' and change from '-' to '_'
                        if (return_type == "real name")
                            resolve(result[0]["character_name"])
                               
                        if (return_type == "actor" ||
                            return_type == "actress" ||
                            return_type == "actress name" ||
                            return_type == "starred")
                            resolve(result[0]["actor_name"])
                               
                        if (return_type == "heavy" ||
                            return_type == "fat" ||
                            return_type == "size" ||
                            return_type == "weigh")
                            resolve(result[0]["weight"])
                        
                        if (return_type == "big" ||
                            return_type == "tall")
                            resolve(result[0]["height"])
                               
                        // character name, weight, height are used as given
                        resolve(result[0][return_type.replace(" ","_")])
                    }
                    else {
                        db.close()
                        resolve("Failed")
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


//connectAndFindDoc('find', {hero_name: "/^Iron*/"}, "ask-facts-actor-name").then(console.log, console.error)
//connectAndFindDoc('find', {hero_name: {$regex: "iron"} }, "real name").then(console.log, console.error)
//connectAndFindDoc('hero_names', "", "").then(console.log, console.error)
module.exports = connectAndFindDoc
