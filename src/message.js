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
        
    const random = array => { return array[Math.floor(Math.random() * array.length)] }
    
    // Send all replies
    message.reply()
    .then(() => {
        // Do some code after sending messages
        // Develop-defined message replies
        if (result.action && result.action.done) {
            if(result.action.slug === 'ask-facts-character-name') {
            connectAndFindDoc({hero_name: result.getMemory('query-hero-name').raw})
            .then(query_result => {
                console.log(query_result)
                message.addReply({type: 'text', content: query_result['character_name'] })/*
                const answers = ["hi","yo","um","hehe","hee"]
                var randomized = random(answers)
                console.log(randomized)
                message.addReply({type: 'text', content: randomized})
                message.reply()
                message.addReply({type: 'text', content: `${query_result.character_name} says hi`})*/
                message.reply()
                })
            }
        }

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
