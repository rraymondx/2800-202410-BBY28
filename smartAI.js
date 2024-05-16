// constant variables needed to make API CALLS
const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");
const messages = document.getElementById("chat-messages");
const openAIKey = process.env.OPEN_AI_KEY;

form.addEventListener("submit", async (e) => {
    // to prevent any default behaviors with the event => (e)
    e.preventDefault();
    const message = input.value;
    input.value = "";

    message.innerHTML += 
    `
        <div class="message user-message">
        <img src="./img/user-icon.png" alt="user icon"> <span>${message}</span>
        </div>
    `;

    // use axios library to make a POST request to the OpenAI API to access CHATGPT
    const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
            prompt: message,
            model: "gpt-3.5-turbo-0125",
            temperature: 0,
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0.0,
            pressence_penalty: 0.0,
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${openAIKey}`,
            },
        }
    );
    // grabs the first responce the chatgpt has for the user.
    const chatGPTResponse = response.data.choices[0].text;

    // actual response into the html file
    message.innerHTML +=
    `
        <div class="message bot-message">
            <img src="./img/bot-icon.png" alt="bot icon"> <span>${chatGPTResponse}</span>
        </div>
    `;
})
