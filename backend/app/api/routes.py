from fastapi import APIRouter, UploadFile, File, HTTPException, WebSocket
from fastapi.responses import JSONResponse
from typing import List, Optional
from pydantic import BaseModel
import tempfile
import os
from app.services.voice_service import VoiceService

router = APIRouter()
voice_service = VoiceService()

class VoiceRequest(BaseModel):
    audio_base64: str
    context: Optional[str] = ""

@router.post("/voice/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """Transcribe audio using Whisper API"""
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        # Transcribe
        transcript = await voice_service.transcribe_audio(tmp_path)
        
        # Cleanup
        os.unlink(tmp_path)
        
        return {"status": "success", "transcript": transcript}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/voice/respond")
async def get_ai_response(request: VoiceRequest):
    """Get AI response using GPT-4o"""
    try:
        # Get AI response
        ai_text = await voice_service.get_ai_response(
            request.audio_base64, 
            request.context
        )
        
        # Convert to speech
        audio_base64 = await voice_service.text_to_speech(ai_text)
        
        return {
            "status": "success", 
            "text": ai_text,
            "audio": audio_base64
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.websocket("/voice/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket for real-time voice communication"""
    await websocket.accept()
    try:
        while True:
            # Receive audio data from frontend
            data = await websocket.receive_text()
            # Process and send response
            # ... WebSocket logic
    except Exception as e:
        print(f"WebSocket error: {e}")