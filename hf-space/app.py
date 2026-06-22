import gradio as gr
from TTS.api import TTS
import tempfile

# XTTS-v2 — multilingual voice cloning
tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2")

SPEAKER_WAV = "suhas.wav"  # committed alongside this file

def synthesize(text: str) -> str:
    if not text or not text.strip():
        return None
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
        out_path = f.name
    tts.tts_to_file(
        text=text.strip(),
        speaker_wav=SPEAKER_WAV,
        language="en",
        file_path=out_path,
    )
    return out_path

demo = gr.Interface(
    fn=synthesize,
    inputs=gr.Textbox(label="Text"),
    outputs=gr.Audio(label="Suhas voice", type="filepath"),
    title="Suhas Voice TTS",
    api_name="synthesize",
)

demo.launch()
