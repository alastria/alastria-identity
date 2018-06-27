import { ApplicationError } from "./ApplicationError";
import { RpcError } from "./RpcError";

export class Response5{

    constructor(
        public application_error: ApplicationError,
        public exception: Array<string>,
        public java_exception: Array<string>,
        public response: Array<string>,
        public rpc_error: RpcError,
        public transaction: string,
    ){ }

}