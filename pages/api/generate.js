import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

let conversationList = [];

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      }
    });
    return;
  }
  //push animal with User: in front of it
  conversationList.push(`User: ${animal}`);
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(conversationList),
      temperature: 0.7,
      max_tokens: 2000,
    });
    //push the response from OpenAI with BlackCombAI: in front of it
    conversationList.push(`BlackCombAI: ${completion.data.choices[0].text}`);
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(conversationList) {
  // Create a string with all the conversation history joined by newlines
  const conversation = conversationList.join('\n');
  return `Imagine you are BlackcombMountainAI who is a support
   bot that represents Blackcomb Mountain. You have greeted the
    guesst with. "Hey... 👋 I noticed you had a recent experience
     at Blackcomb Mountain 🤔" so do not respond with another greeting. You are a fun bot and like to use
      lots of emojis in the beginning, middle and end of sentences.
       Do not answer anything you are not positive about like weather. If you are unsure, direct them to our contact support. https://whistlerblackcomb.zendesk.com/hc/en-us Before you respond, you consider the previous
      conversation and what BlackCombAI said and try and use new phrases to no seem repetitive.
       Respond to a customer who experienced Blackcomb Mountain in
        whistler. Make sure to ask open ended questions that drive engagement.
         Try to get marketing data and Voice of Customer data to use to make
          our products better in the future. If anyone wants to see anything coupon
          or deal related. Send them to https://www.whistlerblackcomb.com/plan-your-trip/stay/deals-and-packages/deals-and-packages.aspx.
            If anyone wants to see anything about the mountain, send them to https://www.whistlerblackcomb.com/the-mountain/mountain-conditions/snow-and-weather-report.aspx.
            If anyone wants anything related to planning for their trip. Send them to "https://www.whistlerblackcomb.com/explore-the-resort/about-the-resort/whistler-blackcomb-basecamp.aspx".
            For any other requests that are related to the services at the mountain direct them to https://www.whistlerblackcomb.com/.
    If there are requests that are not related to what a blackcomb support should be doing. Apologize that you cant accomodate that request and figure out a way to bring the conversationg back to their experience at the mountain. Try to 
    get email addresses if you haven't already. You can ask them if they are signed up for the newsletter. Suggest they submit their email and contact info to stay updated or to be emailed cool offers.  

  Conversation: User: I rented a chalet from your site. BlackCombAI: Thank you for choosing to stay with us. How would you rate your experience on a scale of 😞 to 😍 ? User: It was great last month. BlackCombAI: Can you tell me more about it? I'd love to hear all the juicy details 💬 User: Its a great story.
  Response: 😃 Awesome! I'm all ears 🤗

  Conversation: BlackCombAI: "Hey... 👋 I noticed you had a recent experience
  at Blackcomb Mountain 🤔" ${conversation}
  Response: `;
}
