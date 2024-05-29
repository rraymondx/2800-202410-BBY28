// constant variables needed to make API CALLS
const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");
const messages = document.getElementById("chat-messages");
var messageHistory = [{role: "system", content: "You are a chatbot helping to answer questions about natural disasters. Don't answer any question no related to natural disasers. You are called smartAI."}];

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
        messageHistory.push({role: "user", content: userMessage});
        // use axios library to make a POST request to the OpenAI API to access CHATGPT
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                messages: messageHistory,
                model: "gpt-3.5-turbo",
                temperature: 1.2,
                max_tokens: 1000,
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


        const lines = chatGPTResponse.split('\n');

        messageHistory.push({role: "assistant", content: chatGPTResponse});

        let formattedResponse = "";
        
        for (let i = 0; i < lines.length; i++) {
            formattedResponse += lines[i] + "<br>";
        }

        // Add bot's response to the chat window
        messages.innerHTML +=
        `
            <div class="message bot-message">
                <img src="./img/bot-icon.png" alt="bot icon"> <span>${formattedResponse}</span>
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
