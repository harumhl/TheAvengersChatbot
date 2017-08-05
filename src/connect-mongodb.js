// To use MongoDB
/* // it kinda works
var http = require('http')
var MongoClient = require('mongodb').MongoClient
var myCollection

const connectAndFindDoc = (query, callback) => {
    
    MongoClient.connect("mongodb://haru_recast:haru_recast@ds127963.mlab.com:27963/theavengers", function(err, db) {
        if (err) { console.log('MongoClient.connect error')
                    throw err }
            
        var query_result
        var cursor = db.collection("TheAvengers").find(query)
        cursor.toArray((err, result) => {
            if (err) { console.log('collection.find() error')
                        throw err }
                       
            if (result.length > 0) {
                console.log("Name: ")
                console.log(result[0])
                query_result = result[0]
                db.close()
                callback(err, query_result)
            }
        })
    })
}
var query_result = connectAndFindDoc({hero_name: "Hulk"}, function(err, query_result){
                                     console.log("123")
                                     console.log(query_result)
                                     return query_result})
console.log("end")
console.log(query_result)
*/
var http = require('http')
var MongoClient = require('mongodb').MongoClient
var Promise = require('es6-promise').Promise

const connectAndFindDoc = (query) => {
    return new Promise((resolve, reject) => {
    MongoClient.connect(
        "mongodb://haru_recast:haru_recast@ds127963.mlab.com:27963/theavengers",
        function(err, db) {
            if (err) { console.log('MongoClient.connect error')
                        reject(err) }
                        
            var cursor = db.collection("TheAvengers").find(query)
            cursor.toArray((err, result) => {
                if (err) { console.log('collection.find() error')
                           reject(err) }
                           
                if (result.length > 0) {
                    db.close()
                    resolve(result[0])
                }
            })
        })
    })
}


//connectAndFindDoc({hero_name: "Hulk"}).then(console.log, console.error)
//console.log("the end")
//console.log(query_result)
module.exports = connectAndFindDoc
