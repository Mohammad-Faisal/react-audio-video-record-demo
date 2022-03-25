# react-audio-video-record-demo

First install the required dependency 

```
npm i recordrtc
```

Then import the dependencies and get the required permissions.

```
const [recorder, setRecorder] = useState<any>();
const getPermissionInitializeRecorder = async () => {
    let stream = await (navigator as any).mediaDevices.getUserMedia({
        video: true,
        audio: true
    });
    let recorder = new RecordRTCPromisesHandler(stream, {
        type: "audio"
    });
    setRecorder(recorder);
};

// get the permission on initialization
useEffect(() => {
    getPermissionInitializeRecorder();
}, []);
```

Then create a function to start the recording

```
    // record an audio clip of 20 seconds.
    
    const AUDIO_CLIP_LENGTH_IN_SECONDS = 20;
    const startRecording = async () => {
        setIsRecording(true);
        recorder.startRecording();
        const sleep = (m: any) => new Promise((r) => setTimeout(r, m));
        await sleep(AUDIO_CLIP_LENGTH_IN_SECONDS * 1000);
        await stopRecording();
    };
```

And create another funciton to stop the recording

```
    const stopRecording = async () => {
        setIsRecording(false);
        await recorder.stopRecording();
        let blob = await recorder.getBlob();
        invokeSaveAsDialog(blob, `${any_name}.webm`);
    };
```
And that's it!


```
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { invokeSaveAsDialog, RecordRTCPromisesHandler } from "recordrtc";

interface AudioNoteRecorderProps {
    takeoverId: string;
}

const AUDIO_CLIP_LENGTH_IN_SECONDS = 5;
let myInterval: any = null;

export const AudioRecorder = ({ takeoverId }: AudioNoteRecorderProps) => {
    const [seconds, setSeconds] = useState(AUDIO_CLIP_LENGTH_IN_SECONDS);
    const [recorder, setRecorder] = useState<any>();
    const [isRecording, setIsRecording] = useState(false);

    // get permission and initialize the audio recorder
    const getPermissionInitializeRecorder = async () => {
        let stream = await (navigator as any).mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        let recorder = new RecordRTCPromisesHandler(stream, {
            type: "audio"
        });
        setRecorder(recorder);
    };
    useEffect(() => {
        getPermissionInitializeRecorder();
    }, []);

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
        invokeSaveAsDialog(blob, `${takeoverId}.webm`);
    };

    return (
        <div>
            <Button className={"take-note-btn"} onClick={startRecording}>
                Record Takeover
                {isRecording && <h1>{seconds < 10 ? `0${seconds}` : seconds}</h1>}
            </Button>
        </div>
    );
};
```


To authenticate with Google and upload/download files from google drive

```
import React, {useState} from "react";
import useDrivePicker from "react-google-drive-picker";
import { useEffect } from "react";
import GoogleLogin from 'react-google-login';

const AudioNotes = () => {
    const [openPicker, data, authResponse] = useDrivePicker();
    const [accessToken , setAccessToken] = useState('')


    useEffect(() => {
        if (data) {
            data.docs.map((i) => {
                console.log(i);
            });
        }
    }, [data]);

    const apiKey = "AIzaSyCXQnZaZGEYgp3_Ukgva9T7meT3gVBNJ-E";
    const clientId =
        "453936919472-efu89ef221p6icp18ivtro5lnui0hv9d.apps.googleusercontent.com";

    const handleOpenPicker = () => {
        openPicker({
            clientId,
            developerKey: apiKey,
            token:accessToken,
            // token:"ya29.A0ARrdaM-N88q73RTFieQ9GIWcVpZQ9iaaUloM3eINw1Ghkrqx4Ijp4OUNpFlSHQldW7meClKXpzo4wFD7WjHEYqhrKyUJFWdMWU1mvHXJQGdRdkovflEI5FaZxVuc_Zh486hQuUXs4nyisH06mhQQdjNl9lko",
            viewId: "DOCS",
            showUploadView: true,
            showUploadFolders: true,
            multiselect: true
        });
    };

    const responseGoogle =(response) => {
        console.log('from google login',response)
        setAccessToken(response.accessToken)
    }
    return <div>
        <GoogleLogin
            clientId={clientId}
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
            isSignedIn={true}
            scope={'https://www.googleapis.com/auth/drive'}
        />
        <button onClick={() => handleOpenPicker()}>Open Picker</button>
    </div>
};

export default AudioNotes;
```
