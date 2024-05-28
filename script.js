let recognition;

document.getElementById('startButton').addEventListener('click', startRecognition);

function startRecognition() {
    if ('webkitSpeechRecognition' in window) {
        if (!recognition) {
            recognition = new webkitSpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.continuous = true;

            recognition.onresult = function(event) {
                const userInput = event.results[event.results.length - 1][0].transcript;
                addMessage('user-message', userInput);
                processCommand(userInput);
            };

            recognition.onspeechstart = function() {
                document.getElementById('jarvis-animation').classList.add('active');
            };

            recognition.onspeechend = function() {
                document.getElementById('jarvis-animation').classList.remove('active');
            };

            recognition.onerror = function(event) {
                addMessage('jarvis-message', 'Error occurred in recognition: ' + event.error);
            };
        }

        recognition.start();
    } else {
        addMessage('jarvis-message', 'Speech recognition not supported in this browser.');
    }
}

function stopRecognition() {
    if (recognition) {
        recognition.stop();
    }
}

function addMessage(className, message) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${className}`;
    messageElement.innerText = message;
    document.getElementById('messages').appendChild(messageElement);
    document.getElementById('chatbox').scrollTop = document.getElementById('chatbox').scrollHeight;
}

function processCommand(userInput) {
    let responseText;
    userInput = userInput.toLowerCase().trim();

    if (userInput === 'hello' || userInput === 'hi') {
        responseText = 'Hello! I am your AI assistant.';
    } else if (userInput === 'how are you') {
        responseText = 'I am just a computer program, but thanks for asking!';
    } else if (userInput === 'who are you') {
        responseText = 'I am an AI assistant created to help you with tasks.';
    } else if (userInput.startsWith('who') || userInput.startsWith('what') || userInput.startsWith('where')) {
        // Search on Google
        responseText = `Searching Google for "${userInput}"`;
        window.open(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`, '_blank');
    } else if (userInput.startsWith('open youtube')) {
        responseText = 'Opening YouTube.';
        window.open('https://www.youtube.com', '_blank');
    } else if (userInput.startsWith('open instagram')) {
        responseText = 'Opening Instagram.';
        window.open('https://www.instagram.com', '_blank');
    } else {
        // Default response
        responseText = 'I am sorry, I do not understand that command.';
    }

    addMessage('jarvis-message', responseText);
    stopRecognition();
    speakResponse(responseText);
}

function speakResponse(responseText) {
    const utterance = new SpeechSynthesisUtterance(responseText);
    window.speechSynthesis.speak(utterance);
}
