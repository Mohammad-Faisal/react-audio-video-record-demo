import { invokeSaveAsDialog } from "recordrtc";
import { useRecorderPermission } from "./useRecorderPermission";

interface RecorderProps {
  fileName: string;
}

export const Recorder = ({ fileName }: RecorderProps) => {
  const recorder = useRecorderPermission("audio");

  const startRecording = async () => {
    recorder.startRecording();
  };

  const stopRecording = async () => {
    await recorder.stopRecording();
    let blob = await recorder.getBlob();
    invokeSaveAsDialog(blob, `${fileName}.webm`);
  };

  return (
    <div>
      <button onClick={startRecording}> Start recording</button>
      <button onClick={stopRecording}> Stop recording</button>
    </div>
  );
};
