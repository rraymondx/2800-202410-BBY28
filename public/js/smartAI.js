// constant variables needed to make API CALLS
const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");
const messages = document.getElementById("chat-messages");
const openAIKey = window.openAIKey;

form.addEventListener("submit", async (e) => {
    // to prevent any default behaviors with the event => (e)
    e.preventDefault();
    const userMessage = input.value;
    input.value = "";

    // Add user's message to the chat window
    messages.innerHTML += 
    `
        <div class="message user-message">
        <img src="./img/user-icon.png" alt="user icon"> <span>${userMessage}</span>
        </div>
    `;

    try {
        // use axios library to make a POST request to the OpenAI API to access CHATGPT
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                messages: [
                    { role: "user", content: userMessage }
                ],
                model: "gpt-3.5-turbo",
                temperature: 0,
                max_tokens: 1000,
                top_p: 1,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${openAIKey}`,
                },
            }
        );

        // grabs the first response the chatgpt has for the user.
        const chatGPTResponse = response.data.choices[0].message.content;

        // Add bot's response to the chat window
        messages.innerHTML +=
        `
            <div class="message bot-message">
                <img src="./img/bot-icon.png" alt="bot icon"> <span>${chatGPTResponse}</span>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching from OpenAI API', error);
        messages.innerHTML +=
        `
            <div class="message bot-message">
                <img src="./img/bot-icon.png" alt="bot icon"> <span>Sorry, there was an error processing your request.</span>
            </div>
        `;
    }
});
