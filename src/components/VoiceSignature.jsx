import React, { useState, useRef, useEffect } from 'react';
import './VoiceSignature.css';

const VoiceSignature = ({ onSignatureComplete, predefinedItems, onAddItem, availableCommands }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [signatureStatus, setSignatureStatus] = useState('pending');
  const [transcript, setTranscript] = useState('');
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const recognition = useRef(null);

  // Initialize speech recognition
  const initializeSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event) => {
        const transcriptText = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(transcriptText);
      };

      recognition.current.onend = () => {
        if (isRecording) {
          recognition.current.start();
        }
      };

      recognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setSignatureStatus('failed');
          setIsProcessing(false);
        }
      };
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  const handleVoiceCommand = (transcript) => {
    const cleanTranscript = transcript.toLowerCase().trim();
    setTranscript(`Recognized: ${cleanTranscript}`);
    
    // Check if the transcript matches any item name
    const matchedItem = predefinedItems.find(item => 
      item.name.toLowerCase().includes(cleanTranscript) ||
      cleanTranscript.includes(item.name.toLowerCase())
    );

    if (matchedItem) {
      // Stop recording first to prevent multiple recognitions
      stopRecording();

      // Calculate GST and total
      const quantity = 1; // Default quantity
      const baseAmount = matchedItem.price * quantity;
      const gstAmount = (baseAmount * matchedItem.gstRate) / 100;
      const totalAmount = baseAmount + gstAmount;

      const newItem = {
        itemNumber: matchedItem.id,
        category: matchedItem.category,
        quantity: quantity,
        price: matchedItem.price,
        gstRate: matchedItem.gstRate,
        gstAmount: gstAmount,
        total: totalAmount,
        date: new Date().toISOString().split('T')[0]
      };

      // Add item to bill
      onAddItem(matchedItem.name);
      setSignatureStatus('verified');
      
      // Single feedback message
      const message = `Added ${matchedItem.name} to the bill`;
      setTranscript(message);
      
      // Ensure speech synthesis queue is empty before speaking
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
    } else {
      setSignatureStatus('failed');
      const message = `Could not find item: ${cleanTranscript}`;
      setTranscript(message);
      
      // Ensure speech synthesis queue is empty before speaking
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        `Sorry, I couldn't find ${cleanTranscript} in the items list`
      );
      window.speechSynthesis.speak(utterance);
    }
  };

  const startRecording = async () => {
    try {
      setSignatureStatus('pending');
      setTranscript(''); // Clear previous transcript
      if (!recognition.current) {
        initializeSpeechRecognition();
      }
      recognition.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to start recording. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (recognition.current) {
      recognition.current.stop();
    }
    setIsRecording(false);
    setIsProcessing(false);
  };

  const getStatusMessage = () => {
    switch (signatureStatus) {
      case 'verified':
        return 'Voice command processed successfully! ✅';
      case 'failed':
        return 'Command not recognized. Please try again. ❌';
      case 'cancelled':
        return 'Operation cancelled ⚠️';
      default:
        return 'Please speak your command';
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, []);

  return (
    <div className="voice-signature">
      <div className="signature-header">
        <h3>Voice Command Recognition</h3>
        <p className="signature-subtitle">
          Use voice commands to add items to your bill
        </p>
      </div>

      <div className="signature-content">
        <div className={`record-button ${isRecording ? 'recording' : ''}`}>
          {!isRecording ? (
            <button 
              onClick={startRecording}
              disabled={isProcessing}
              className="start-record"
            >
              🎤 Start Speaking
            </button>
          ) : (
            <button 
              onClick={stopRecording}
              className="stop-record"
            >
              ⏹️ Stop Recording
            </button>
          )}
        </div>

        {isRecording && (
          <div className="recording-indicator">
            Listening...
            <div className="wave-animation">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        {transcript && (
          <div className="transcript">
            <h4>Recognized Speech:</h4>
            <p>{transcript}</p>
          </div>
        )}

        {isProcessing && (
          <div className="processing-indicator">
            Processing...
            <div className="spinner"></div>
          </div>
        )}

        <div className={`signature-status ${signatureStatus}`}>
          {getStatusMessage()}
        </div>

        {signatureStatus === 'verified' && (
          <div className="verification-details">
            <p>✓ Voice command recognized</p>
            <p>✓ Item added to bill</p>
          </div>
        )}

        <div className="available-commands">
          <h3>Available Items:</h3>
          <div className="commands-list">
            {availableCommands.map((command, index) => (
              <span key={index} className="command-item">{command}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceSignature; 