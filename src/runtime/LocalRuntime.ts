import axios from "axios";
import { BaseFaasitRuntime, CallResult, FaasitRuntimeMetadata } from "./FaasitRuntime";

export class LocalRuntime extends BaseFaasitRuntime {

    name: string = "local"

    private event: any;
    constructor(event: any) {
        super()
        this.event = event;
    }
    metadata(): FaasitRuntimeMetadata {
        return {
            funcName: "local",
            invocation: {
                id: "local",
                caller: {
                    funcName: "local",
                    invocationId: "local"
                },
                kind: "call"
            }
        
        }
    }
    async call(fnName: string, fnParams: {
        sequence?: number;
        input: object;
    }): Promise<CallResult> {
        console.log("call funtion");
        const axiosInstance = axios.create();
        const url = `http://master:9000/${fnName}`
        const resp = await axiosInstance.post(url, fnParams.input)
        console.log(resp.data);
        return { output: resp.data };
    }

    input() {
        return this.event;
    }

    output(returnObject: any) {
        return returnObject
    }
}