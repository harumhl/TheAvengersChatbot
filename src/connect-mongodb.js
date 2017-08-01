// To use MongoDB
var http = require('http')
var MongoClient = require('mongodb').MongoClient
var myCollection

const findDocument = (query) => {
    var cursor = myCollection.find(query)
    cursor.toArray(function(err, result){
        if (err) { console.log('collection.find() error')
                   throw err }
        console.log(result)
        if (result.length > 0)
            console.log("Actor: " + result[0]["actor"] + "\n")
    });
}
const connectAndFindDoc = (query) => {
    
    MongoClient.connect("mongodb://haru_recast:haru_recast@ds127963.mlab.com:27963/theavengers", function(err, db) {
        if (err) { console.log('MongoClient.connect error')
                    throw err }
            
        myCollection = db.collection("TheAvengers")
        var query_result = findDocument(query)
        db.close()
        return query_result
    })
}




module.exports = connectAndFindDoc
