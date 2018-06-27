export class RpcError{

    constructor(
        public code: number,
        public detail: string
    ){ }

}