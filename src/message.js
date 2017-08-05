/*
 * message.js
 * This file contains your bot code
 */

const recastai = require('recastai')
const connectAndFindDoc = require('./connect-mongodb')

// This function is the core of the bot behaviour
const replyMessage = (message) => {
  // Instantiate Recast.AI SDK, just for request service
  const request = new recastai.request(process.env.REQUEST_TOKEN, process.env.LANGUAGE)
  // Get text from message received
  const text = message.content

  console.log('I receive: ', text)

  // Get senderId to catch unique conversation_token
  const senderId = message.senderId

  // Call Recast.AI SDK, through /converse route
  request.converseText(text, { conversationToken: senderId })
  .then(result => {
    /*
    * YOUR OWN CODE
    * Here, you can add your own process.
    * Ex: You can call any external API
    * Or: Update your mongo DB
    * etc...
    */
    if (result.action) {
      console.log('The conversation action is: ', result.action.slug)
    }
    
    // If there is not any message return by Recast.AI for this current conversation
    if (!result.replies.length) {
      message.addReply({ type: 'text', content: 'I don\'t have the reply to this yet :)' })
    } else {
      // Add each reply received from API to replies stack
      result.replies.forEach(replyContent => message.addReply({ type: 'text', content: replyContent }))
    }

        
    //
    console.log(message)
    message.addReply({type: 'text', content: "hi"})
    if (result.action && result.action.done) {
        if(result.action.slug === 'ask-facts-character-name') {
            var query_result = connectAndFindDoc({hero_name: result.getMemory('query-hero-name').raw})
        
            console.log(query_result)
            console.log(query_result[_result]['character_name'])
            console.log(result)
            message.addReply({ type: 'text', content: query_result[_result]['character_name'] })
            message.addReply({ type: 'text', content: 'whatever' })
            message.addReply(query_result)
        }
    }
        
        
        
    // Send all replies
    message.reply()
    .then(() => {
        // Do some code after sending messages
    })
    .catch(err => {
      console.error('Error while sending message to channel', err)
    })
  })
  .catch(err => {
    console.error('Error while sending message to Recast.AI', err)
  })
}

module.exports = replyMessage
