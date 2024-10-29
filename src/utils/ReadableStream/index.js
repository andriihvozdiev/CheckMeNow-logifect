import ReadableStreamDefaultReader from "./ReadableStreamDefaultReader"

class ReadableStream {
    constructor(fileUri) {
        this.#is_locked = false;
        this.#fileUri = fileUri;
    }
    get locked() {
        console.log("get locked")
        return this.#is_locked;
    }

    cancel() {
        console.log("cancel called")
    }

    getReader(){
        console.log("getReader called")
        return new ReadableStreamDefaultReader(this.#fileUri);
    }

    tee(){
        console.log("tee called")
        throw "Not implemented tee was called"
    }
}

export default ReadableStream;