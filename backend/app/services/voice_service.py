import openai
import os
import base64
from app.config import settings

class VoiceService:
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY
    
    async def transcribe_audio(self, audio_file):
        """Convert speech to text using Whisper API"""
        try:
            with open(audio_file, "rb") as audio:
                transcript = openai.Audio.transcribe(
                    model="whisper-1",
                    file=audio,
                    response_format="text"
                )
            return transcript
        except Exception as e:
            raise Exception(f"Transcription failed: {str(e)}")
    
    async def get_ai_response(self, text, context=""):
        """Get AI response using GPT-4"""
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are an AI interviewer. You are conducting a mock technical interview. Respond concisely and professionally."},
                    {"role": "user", "content": f"Context: {context}\n\nCandidate said: {text}\n\nProvide your response as an interviewer."}
                ],
                max_tokens=150,
                temperature=0.7
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"AI response failed: {str(e)}")
    
    async def text_to_speech(self, text):
        """Convert text to speech using OpenAI TTS"""
        try:
            response = openai.Audio.speech.create(
                model="tts-1",
                voice="alloy",  # Options: alloy, echo, fable, onyx, nova, shimmer
                input=text
            )
            # Convert to base64 for frontend
            audio_base64 = base64.b64encode(response.content).decode('utf-8')
            return audio_base64
        except Exception as e:
            raise Exception(f"TTS failed: {str(e)}")