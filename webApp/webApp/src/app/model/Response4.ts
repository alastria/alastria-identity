import { ApplicationError } from "./ApplicationError";
import { RpcError } from "./RpcError";

export class Response4{

    constructor(
        public application_error: ApplicationError,
        public exception: Array<string>,
        public java_exception: Array<string>,
        public public_key: string,
        public response: Array<string>,
        public rpc_error: RpcError,
    ){ }

}