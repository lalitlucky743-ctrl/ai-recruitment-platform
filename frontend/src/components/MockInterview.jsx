import React, { useState, useRef, useEffect } from 'react';
import { Mic, Play, Square, Download, AlertCircle, Volume2 } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

const RADAR_DATA = [
  { trait: "Communication", score: 88 }, 
  { trait: "Technical Depth", score: 79 },
  { trait: "Problem Solving", score: 84 }, 
  { trait: "Confidence", score: 91 },
  { trait: "Clarity", score: 86 },
];

const MockInterview = ({ theme }) => {
  const t = THEMES[theme];
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiAudio, setAiAudio] = useState(null);
  const [error, setError] = useState("");
  const [conversation, setConversation] = useState([
    { speaker: "AI", text: "Hello! I'm your AI interviewer. Can you tell me about your experience with React?" }
  ]);
  
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const streamRef = useRef(null);
  const audioRef = useRef(null);

  // API URL
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Start Recording
  const startRecording = async () => {
    try {
      setError("");
      setAiResponse("");
      setAiAudio(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        // Convert to audio blob
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        await processVoice(audioBlob);
      };

      mediaRecorder.current.start(1000);
      setIsRecording(true);
      
      // Auto-stop after 8 seconds
      setTimeout(() => {
        if (mediaRecorder.current && isRecording) {
          stopRecording();
        }
      }, 8000);
      
    } catch (err) {
      console.error("Microphone error:", err);
      setError("Microphone access denied. Please allow microphone permissions.");
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  // Process Voice - Send to Backend
  const processVoice = async (audioBlob) => {
    setIsProcessing(true);
    setTranscript("Processing your response...");
    
    try {
      // Step 1: Send audio to backend for transcription
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.wav');
      
      const transcribeRes = await fetch(`${API_URL}/api/v1/voice/transcribe`, {
        method: 'POST',
        body: formData,
      });
      
      if (!transcribeRes.ok) throw new Error('Transcription failed');
      
      const transcribeData = await transcribeRes.json();
      const userText = transcribeData.transcript;
      setTranscript(`You said: "${userText}"`);
      
      // Step 2: Get AI Response
      const responseRes = await fetch(`${API_URL}/api/v1/voice/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audio_base64: userText,
          context: "Technical interview for Frontend Engineer position"
        })
      });
      
      if (!responseRes.ok) throw new Error('AI response failed');
      
      const responseData = await responseRes.json();
      setAiResponse(responseData.text);
      
      // Step 3: Play AI Voice Response
      if (responseData.audio) {
        const audioSrc = `data:audio/mp3;base64,${responseData.audio}`;
        setAiAudio(audioSrc);
        
        // Auto-play AI response
        if (audioRef.current) {
          audioRef.current.src = audioSrc;
          await audioRef.current.play();
        }
      }
      
      // Update conversation
      setConversation(prev => [
        ...prev,
        { speaker: "You", text: userText },
        { speaker: "AI", text: responseData.text }
      ]);
      
      setIsProcessing(false);
      setIsDone(true);
      
    } catch (err) {
      console.error("Process error:", err);
      setError(`Error: ${err.message}`);
      setIsProcessing(false);
    }
  };

  // Play AI Audio
  const playAiAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  // Download Report
  const downloadReport = () => {
    const content = `RECRUIT.AI — AI INTERVIEW REPORT
Candidate: Candidate
Date: ${new Date().toLocaleDateString()}

INTERVIEW CONVERSATION:
${conversation.map(c => `${c.speaker}: ${c.text}`).join('\n')}

TECHNICAL SCORE: 82 / 100
COMMUNICATION SCORE: 88 / 100

STRENGTHS
- Structured, specific answers with concrete metrics
- Good communication skills

WEAKNESSES
- Could provide more detailed examples

HIRING RECOMMENDATION
Proceed to the next round.`;
    
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; 
    a.download = `Interview_Report_${Date.now()}.txt`;
    document.body.appendChild(a); 
    a.click(); 
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <Card theme={theme} style={{ flex: 1, minWidth: 300 }}>
        <div style={{ fontFamily: "Space Grotesk", fontWeight: 600, color: t.text, marginBottom: 4 }}>
          Live AI Mock Interview 🎙️🤖
        </div>
        <p style={{ color: t.muted, fontSize: 13, marginTop: 0, marginBottom: 16 }}>
          Speak naturally. AI will respond with voice and text feedback.
        </p>

        {error && (
          <div style={{
            background: `${t.danger}22`, 
            color: t.danger,
            padding: 12,
            borderRadius: 8,
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Conversation Display */}
        <div style={{
          background: t.surface2, 
          borderRadius: 12, 
          padding: 16, 
          marginBottom: 14,
          maxHeight: 200,
          overflow: 'auto',
          minHeight: 120,
        }}>
          {conversation.map((msg, idx) => (
            <div key={idx} style={{
              display: 'flex',
              gap: 8,
              marginBottom: 8,
              fontSize: 13,
              color: msg.speaker === "AI" ? t.accent : t.text
            }}>
              <b>{msg.speaker}:</b>
              <span style={{ color: t.muted }}>{msg.text}</span>
            </div>
          ))}
          
          {isRecording && (
            <div style={{ display: 'flex', gap: 8, fontSize: 13 }}>
              <b style={{ color: t.accent2 }}>🎤 You:</b>
              <span style={{ color: t.muted }}>
                <span className="recording-pulse">● Recording...</span>
              </span>
            </div>
          )}
          
          {isProcessing && (
            <div style={{ display: 'flex', gap: 8, fontSize: 13 }}>
              <b style={{ color: t.accent2 }}>🤖 AI:</b>
              <span style={{ color: t.muted }}>
                <TypingCycle theme={theme} phrases={["Thinking...", "Analyzing response...", "Generating reply..."]} />
              </span>
            </div>
          )}
        </div>

        {/* Voice Visualizer */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, height: 26, marginBottom: 16 }}>
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} className={isRecording ? "wave-bar" : ""} style={{
              width: 3, 
              borderRadius: 2, 
              background: isRecording ? t.accent : t.border,
              height: isRecording ? undefined : 6, 
              animationDelay: `${i * 0.06}s`,
            }} />
          ))}
        </div>

        {/* AI Voice Player */}
        {aiAudio && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 10,
            padding: 10,
            background: `${t.accent2}22`,
            borderRadius: 8,
            marginBottom: 10
          }}>
            <Volume2 size={16} color={t.accent2} />
            <span style={{ fontSize: 13, color: t.muted }}>AI Voice Response</span>
            <button onClick={playAiAudio} style={{
              padding: '4px 12px',
              borderRadius: 6,
              border: `1px solid ${t.accent2}`,
              background: 'transparent',
              color: t.text,
              cursor: 'pointer',
              fontSize: 12
            }}>
              ▶ Play
            </button>
            <audio ref={audioRef} style={{ display: 'none' }} />
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          {!isRecording && !isProcessing && !isDone && (
            <button onClick={startRecording} style={{
              flex: 1,
              padding: "11px 0", 
              borderRadius: 10, 
              border: "none",
              background: t.accent2, 
              color: "#04231D",
              fontWeight: 700, 
              fontSize: 14, 
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}>
              <Mic size={14} /> Start Speaking
            </button>
          )}
          
          {isRecording && (
            <button onClick={stopRecording} style={{
              flex: 1,
              padding: "11px 0", 
              borderRadius: 10, 
              border: "none",
              background: t.danger, 
              color: "white",
              fontWeight: 700, 
              fontSize: 14, 
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}>
              <Square size={14} /> Stop Recording
            </button>
          )}
          
          {isDone && (
            <>
              <button onClick={() => {
                setIsDone(false);
                setConversation(prev => [
                  ...prev,
                  { speaker: "AI", text: "Let's continue! What else would you like to discuss?" }
                ]);
              }} style={{
                flex: 1,
                padding: "11px 0", 
                borderRadius: 10, 
                border: "none",
                background: t.surface2, 
                color: t.text,
                fontWeight: 700, 
                fontSize: 14, 
                cursor: "pointer",
              }}>
                Continue Interview
              </button>
              <button onClick={downloadReport} style={{
                padding: "11px 20px", 
                borderRadius: 10, 
                border: "none",
                background: t.accent, 
                color: "#1A1200",
                fontWeight: 700, 
                fontSize: 14, 
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}>
                <Download size={14} /> Report
              </button>
            </>
          )}
        </div>
      </Card>

      <Card theme={theme} style={{ flex: 1, minWidth: 300 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontFamily: "Space Grotesk", fontWeight: 600, color: t.text }}>Feedback Breakdown</div>
        </div>
        
        {!isDone && !isRecording && !isProcessing && (
          <div style={{ 
            color: t.muted, 
            fontSize: 13.5, 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            padding: "30px 0", 
            gap: 10 
          }}>
            <Mic size={26} /> 
            Start the interview to get AI feedback.
          </div>
        )}
        
        {(isRecording || isProcessing) && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Shimmer theme={theme} lines={3} />
            <div style={{ 
              color: t.muted, 
              fontSize: 13, 
              textAlign: "center",
              padding: 10,
              background: t.surface2,
              borderRadius: 8
            }}>
              {isRecording ? "🎤 Recording in progress..." : "🧠 AI is thinking..."}
            </div>
          </div>
        )}
        
        {isDone && (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke={t.border} />
                <PolarAngleAxis dataKey="trait" tick={{ fill: t.muted, fontSize: 11 }} />
                <Radar dataKey="score" stroke={t.accent2} fill={t.accent2} fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
            <div style={{ 
              textAlign: "center", 
              color: t.muted, 
              fontSize: 12,
              marginTop: 10
            }}>
              ✓ AI interview complete! Click "Continue Interview" for more questions.
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default MockInterview;