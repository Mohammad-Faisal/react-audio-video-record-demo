import React, { useState } from "react";
import { invokeSaveAsDialog } from "recordrtc";
import { useRecorderPermission } from "./useRecorderPermission";

interface RecorderProps {
  fileName: string;
}

const AUDIO_CLIP_LENGTH_IN_SECONDS = 5;
let myInterval: any = null;

export const RecorderTimer = ({ fileName }: RecorderProps) => {
  const [seconds, setSeconds] = useState(AUDIO_CLIP_LENGTH_IN_SECONDS);
  const [isRecording, setIsRecording] = useState(false);
  const recorder = useRecorderPermission("audio");

  const resetTimer = () => {
    clearInterval(myInterval);
    setSeconds(AUDIO_CLIP_LENGTH_IN_SECONDS);
  };

  const triggerTimer = async () => {
    myInterval = setInterval(() => {
      if (seconds > 0) {
        console.log("continue ", seconds);
        setSeconds((seconds) => seconds - 1);
      }
    }, 1000);
  };

  const startRecording = async () => {
    setIsRecording(true);
    await triggerTimer();
    recorder.startRecording();
    const sleep = (m: any) => new Promise((r) => setTimeout(r, m));
    await sleep(AUDIO_CLIP_LENGTH_IN_SECONDS * 1000);
    await stopRecording();
  };

  const stopRecording = async () => {
    setIsRecording(false);
    await recorder.stopRecording();
    let blob = await recorder.getBlob();
    resetTimer();
    invokeSaveAsDialog(blob, `${fileName}.webm`);
  };

  return (
    <div>
      <button onClick={startRecording}>
        Record Takeover
        {isRecording && <h1>{seconds < 10 ? `0${seconds}` : seconds}</h1>}
      </button>
    </div>
  );
};
