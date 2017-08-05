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
var myCollection
var query_result
var flag = false

const _connectAndFindDoc = (query, callback, result_storage) => {
    
    MongoClient.connect("mongodb://haru_recast:haru_recast@ds127963.mlab.com:27963/theavengers", function(err, db) {
        if (err) { console.log('MongoClient.connect error')
                    throw err }
                        
        var cursor = db.collection("TheAvengers").find(query)
        cursor.toArray((err, result) => {
            if (err) { console.log('collection.find() error')
                        throw err }
                       
            if (result.length > 0) {
                db.close()
                callback(err, result[0], result_storage)
            }
        })
    })
}

const connectAndFindDoc = (query, result_storage) => {
    _connectAndFindDoc (query,
                        function(err, result0, result_storage){
                            result_storage = result0
                            query_result = result0
                        },
                        result_storage)
    var i = 0
    var theInterval = setInterval(function(){console.log(i)
                                i = i + 1
                                if(typeof query_result !== 'undefined' || i >= 20) // 5 sec
                                    clearInterval(theInterval);
                                    console.log(query_result)
                                  }, 250)
    //return query_result
    return Promise.resolve({ type: 'text', content: query_result })
}



//connectAndFindDoc({hero_name: "Hulk"}, query_result)
//console.log("the end")
//console.log(query_result)
module.exports = connectAndFindDoc
