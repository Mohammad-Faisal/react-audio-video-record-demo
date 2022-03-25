# Audio and Video Recorder in ReactJS

### Leverage the power of recordrtc library

Recording Audio and Video using your browser application is a fairly common use-case for many applications. Especially note taking applications.

To implement this features there is already a nice library called [recordrtc](https://www.npmjs.com/package/recordrtc) for us. Let's see how we can use that inside our React application.

First install the dependency

```sh
yarn add recordrtc
```

### Get the permission

In order to record audio or video using your ReactJS application you will have to get the users permission.

And our **recordrtc** library makes it easy. Just create a function to get the permission and initialize an instance of the recorder

```js
const getPermissionInitializeRecorder = async () => {
    let stream = await (navigator as any).mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    let recorder = new RecordRTCPromisesHandler(stream, {
      type: recordingType,
    });
    return recorder
  };
```

We can even make this a re-usable hook

```js
import { useState, useEffect } from "react";
import RecordRTC, { RecordRTCPromisesHandler } from "recordrtc";

export const useRecorderPermission = (
  recordingType: RecordRTC.Options["type"]
) => {
  const [recorder, setRecorder] = useState<any>();

  useEffect(() => {
    getPermissionInitializeRecorder();
  }, []);

  const getPermissionInitializeRecorder = async () => {
    let stream = await (navigator as any).mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    let recorder = new RecordRTCPromisesHandler(stream, {
      type: recordingType,
    });
    setRecorder(recorder);
  };

  return recorder;
};
```

Notice we are passing a **recordingType** parameter inside the hook. This will determine if we are trying to record **audio** or **video** or something else.

We can use this inside our component like this

```js
const recorder = useRecorderPermission("audio");
```

### Let's Record!

So now we have our hook that get's the permission from the user and initiates a recorder object and return that to us.

Let's write 2 functions to start and stop recording

```js
import { invokeSaveAsDialog } from "recordrtc";

export const AudioRecorder = () => {
  const recorder = useRecorderPermission("audio");

  const startRecording = async () => {
    recorder.startRecording();
  };

  const stopRecording = async () => {
    await recorder.stopRecording();
    let blob = await recorder.getBlob();
    invokeSaveAsDialog(blob, `random_name.webm`);
  };

  return (
    <div>
      <button onClick={startRecording}> Start recording</button>
      <button onClick={stopRecording}> Stop recording</button>
    </div>
  );
};
```

Notice that we are using our recorder's **startRecording** and **stopRecording** function.
We are also getting an additional function from the library named **invokeSaveAsDialog** that allows us to specify the name for the file being saved.

### Record using timer.

If you want to record a specific time periods recording. Let's say you want a 20 second recording to be recorded whenever a button has been clicked. You can do that using the following code.

```js
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
```

Notice how we have made the file name customizable by passing a prop from the parent.
Also you can see the number of seconds remaining for the recording.

### Video recording

If you want to record video of the screen then just pass "video" instead of "audio" inside our **useRecorderPermission** hook and thats it!

That's it. I hope you learned something new today!

Article Link:
https://www.mohammadfaisal.dev/blog/react-audio-video-recording
