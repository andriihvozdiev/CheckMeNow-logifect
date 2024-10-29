import RNFS from 'react-native-fs';

class ReadableStreamDefaultReader {
    constructor(fileUri){
        this.#fileUri = fileUri;
    }

    get closed(){
        console.log("Called closed");
        return new Promise((resolve, reject)=>{
            resolve("Closed");
        })
    }

    cancel() {
        console.log("reader cancel called");
    }

    read(){
        console.log("read called");
        return new Promise((resolve, reject)=>{
            const fileContentBase64 = await RNFS.read(uri, 'base64');
            resolve({value:fileContentBase64, done: true});
        });
    }

    releaseLock(){
        console.log("releaseLock called");
    }

}

export default ReadableStreamDefaultReader;