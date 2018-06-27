import { ApplicationError } from "./ApplicationError";
import { RpcError } from "./RpcError";

export class Response3{

    constructor(
        public alastria_id: string,
        public application_error: ApplicationError,
        public exception: Array<string>,
        public java_exception: Array<string>,
        public response: Array<string>,
        public rpc_error: RpcError,
    ){ }

}