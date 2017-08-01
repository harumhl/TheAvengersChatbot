// To use MongoDB
var http = require('http')
var MongoClient = require('mongodb').MongoClient
var myCollection

const findDocument = (query) => {
    var cursor = myCollection.find(query)
    var query_result
    cursor.toArray((err, result) => {
        if (err) { console.log('collection.find() error')
                   throw err }
                   
        if (result.length > 0) {
            console.log("Name: " + result[0])
            return result[0]
        }
    }).then((res) => {
        query_result = res
    })
    console.log("query result1: " + query_result)
    return query_result
}
const connectAndFindDoc = (query) => {
    
    var query_result
    MongoClient.connect("mongodb://haru_recast:haru_recast@ds127963.mlab.com:27963/theavengers", function(err, db) {
        if (err) { console.log('MongoClient.connect error')
                    throw err }
            
        myCollection = db.collection("TheAvengers")
        var query_result = findDocument(query)
        db.close()
        return query_result
    }).then((res) => {
        query_result = res
    })
    return query_result
}




module.exports = connectAndFindDoc
//var query_request = connectAndFindDoc({hero_name: "Hulk"})
//console.log(query_result)
