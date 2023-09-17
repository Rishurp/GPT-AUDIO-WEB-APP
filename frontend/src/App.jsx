import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Artyom from 'artyom.js';
import SmartToyIcon from '@mui/icons-material/SmartToy';


const artyom = new Artyom();

const options = {
  continuous: true
};

function App() {
  const [gptReply, setGptReply] = useState("");

  const {
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    finalTranscript
  } = useSpeechRecognition();


  useEffect(() => {
    if (finalTranscript !== "") {
      getResponse(finalTranscript);
    }
  }, [finalTranscript]);



  if (!browserSupportsSpeechRecognition) {
    return <span>Your Browser doesn't support speech recognition.</span>;
  }

  const startListeningAtPress = () => {
    SpeechRecognition.startListening(options);
  };



  const getResponse = async (text) => {
    await axios.post("https://gpt-audio-web-app-egem.onrender.com/api/voice"
     ,
      {
        text: text
      },
      {
        headers: {
        'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }
    ).then(({ data }) => {
      setGptReply(data.result.message.content);
      artyom.say(data.result.message.content);
    }).then(() => {
      resetTranscript();
    });
  };


  return (
    <div className="App">
      <div className="main">
        <p>GPT BOT <SmartToyIcon/> :  {listening ? ' listening' : 'Waiting for Command'}</p>
        <button onClick={startListeningAtPress}>Start Speaking</button>
        <button onClick={SpeechRecognition.stopListening}>Stop Speaking</button>
        <p>{finalTranscript}</p>
        <p>{gptReply}</p>
      </div>
    </div>
  );
}

export default App;
