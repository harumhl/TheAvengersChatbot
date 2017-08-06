/*
 * message.js
 * This file contains your bot code
 */

const recastai = require('recastai')
const connectAndFindDoc = require('./connect-mongodb')
const random = array => { return array[Math.floor(Math.random() * array.length)] }

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
        
    // Send all replies
    message.reply()      // Original reply in https://recast.ai is sent back first, usually "hmm.."
    .then(() => {
        // Developer-defined message replies
        if (result.action && result.action.done) {
            // User asks the bot to translate one name into another (e.g. Iron Man -> Tony Stark)
            console.log(result.getMemory('query-hero-name'))
            if(result.action.slug === 'ask-facts-character-name' ||
               result.action.slug === 'ask-facts-hero-name' ||
               result.action.slug === 'ask-facts-actor-name' ||
               result.action.slug === 'ask-facts-weight' ||
               result.action.slug === 'ask-facts-height') {
            connectAndFindDoc('find', {hero_name: result.getMemory('query-hero-name').raw},
                              result.action.slug)
            .then(query_result => {
                console.log(result.getMemory('query-hero-name'))
                console.log(query_result)
                  
                const answers = [`I think it's ${query_result}`,
                                 `It's ${query_result}, isn't it?`,
                                 `If I remember correctly, it is ${query_result}.`,
                                 `My memory tells me it is ${query_result}`,
                                 `Hmm, I have a strong feeling it must be ${query_result}`,
                                 `I would guess that it is ${query_result}`]
                message.addReply({type: 'text', content: random(answers)})
                message.reply()
                .then(() => console.log("answered for " + result.action.slug))
                .catch(err => console.error('Error in ask-facts-character-name reply: ', err))
                })
            }
            // User asks the bot what its favorite hero is
            else if(result.action.slug === 'ask-bot-favorite-hero') {
            // In order to keep everything synchronous, call mongoDB whether bot-fav-hero is set or not
            connectAndFindDoc('hero_names', "", "")
            .then(query_result => {
                // After getting a list of heroes, check if there's one in memory or pick one randomly
                // (since null.value cannot be done, keep favorite_hero as a dict, not a string)
                var favorite_hero = result.getMemory('bot-favorite-hero') ||
                                    {value: random(query_result)}
                if(result.getMemory('bot-favorite-hero') === null) console.log("null")
                if(result.getMemory('bot-favorite-hero') == null) console.log("null2")
                  
                if(typeof result.getMemory('bot-favorite-hero') === 'undefined') console.log("to undi")
                if(typeof result.getMemory('bot-favorite-hero') == 'undefined') console.log("to undi2")
                
                if(!(result.getMemory('bot-favorite-hero'))) console.log("exclaim")
                
                if(result.getMemory('bot-favorite-hero') === 'undefined') console.log("undefined")
                if(result.getMemory('bot-favorite-hero') == 'undefined') console.log("undefined2")
                  
                if(result.getMemory('bot-favorite-hero') === null ||
                   typeof result.getMemory('bot-favorite-hero') === 'undefined' ||
                   !(result.getMemory('bot-favorite-hero'))
                   result.getMemory('bot-favorite-hero') === 'undefined') {
                 //   result.setMemory({"bot-favorite-hero":{value: favorite_hero.value}})
                    console.log("failed")
                  
                }
                console.log(result.getMemory('bot-favorite-hero'))
                console.log(typeof result.getMemory('bot-favorite-hero'))
                console.log(favorite_hero)
                      
                // Answering back - whether it's just picked or it was decided previously
                const answers = [`My favorite hero is ${favorite_hero.value}`,
                                `It's ${favorite_hero.value}`,
                                `${favorite_hero.value} is simply the best!`,
                                `${favorite_hero.value} is my hero and it won't change'`]
                message.addReply({type: 'text', content: random(answers)})
                message.reply()
                .then(() => console.log("answered for ask-bot-favorite-hero"))
                .catch(err => console.error('Error in ask-bot-favorite-hero reply: ', err))
            })
            .catch(err => console.error('Error from connectAndFindDoc(hero_names): ', err))
            }
        } // end of if (result.action && result.action.done)
    }) // end of message.reply().then
    .catch(err => {
      console.error('Error while sending message to channel', err)
    })
  })
  .catch(err => {
    console.error('Error while sending message to Recast.AI', err)
  })
}

module.exports = replyMessage
