interface VALID_OP_RESULT<T> {
    status: 200;
    json: T;
}

interface PARTIAL_OP_RESULT<T> {
    status: 207;
    json: T;
}

interface INVALID_OP_RESULT {
    status: number;
    json: {
        message: string;
        error?: INVALID_OP_RESULT | Array<INVALID_OP_RESULT>;
    };
}
export type AGENT_OP_RESULT<T = any> =
    | VALID_OP_RESULT<T>
    | PARTIAL_OP_RESULT<T>
    | INVALID_OP_RESULT;
