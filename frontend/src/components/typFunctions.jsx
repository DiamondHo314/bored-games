const BACKEND_URL = "http://localhost:8080";

export function correctCounter(typedWords, sentenceWords) {
  let correctCount = 0;
  const wrongWords = [];
  for (let i = 0; i < Math.min(typedWords.length, sentenceWords.length); i++) {
    // we need the min because typedwords can be longer or shorter than the words in the sentence
    // if the word is correct, increase the count
    if (typedWords[i] === sentenceWords[i]) {
      correctCount++;
    } else {
      wrongWords.push(sentenceWords[i]); // add the original word that the user got wrong
    }
  }
  return [correctCount, wrongWords];
}

export async function postTypingGameScore(timerOption, wpm, acc) {
  return await fetch(`${BACKEND_URL}/scores/typing`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include credentials for session management
    body: JSON.stringify({ timerOption, wpm, acc }),
  })
  .then(res => {
    if (!res.ok) {
      throw new Error("Failed to post typing game score");
    }
    return res.json();
  })
  .catch(error => {
    console.error("Error posting typing game score:", error);
    throw error;
  });
}

//post wrong words to the database
export async function postWrongWords(wrongWords) {
  return await fetch(`${BACKEND_URL}/sentences/wrong`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', 
    body: JSON.stringify({ wrongWords }),
  })
  .then(res => {
    if (!res.ok) {
      throw new Error("Failed to post wrong words");
    }
    return res.json();
  })
  .catch(error => {
    console.error("Error posting wrong words:", error);
    throw error;
  });
}

export async function aiGenerateSentence() {
    return await fetch(`${BACKEND_URL}/ai-typing-coach`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
        credentials: 'include',     
    })
    .then(res => {
        if (!res.ok) {
        throw new Error("Failed to generate sentences from AI");
        }
        return res.json();
    })
    .catch(error => {
        console.error("Error generating sentences from AI:", error);
        throw error;
    });
}