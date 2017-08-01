// To use MongoDB
var http = require('http')
var MongoClient = require('mongodb').MongoClient
var myCollection

const findDocument = (query) => {
    var cursor = myCollection.find(query)
    return cursor.toArray((err, result) => {
        if (err) { console.log('collection.find() error')
                   throw err }
                   
        if (result.length > 0) {
            console.log(result[0]['character_name'])
            return result[0]['character_name']
        }
    })
}
const connectAndFindDoc = (query) => {
    
    return MongoClient.connect("mongodb://haru_recast:haru_recast@ds127963.mlab.com:27963/theavengers", function(err, db) {
        if (err) { console.log('MongoClient.connect error')
                    throw err }
            
        myCollection = db.collection("TheAvengers")
        var query_result = findDocument(query)
        db.close()
        return query_result
    })
}




//module.exports = connectAndFindDoc
var query_request = connectAndFindDoc({hero_name: "Hulk"})
//console.log(query_result)
