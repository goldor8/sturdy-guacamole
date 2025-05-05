export class WebError {
    status: number;
    message: string;

    constructor(status: number, message: string) {
        this.status = status;
        this.message = message;
    }
}

export function buildWebError(status: number, message: string): WebError {
    return new WebError(status, message);
}

export function handleWebError(err: WebError, res: any): void {
    sendError(res, err);
}

export function handleError(err: any, res: any): void {
    if (err instanceof WebError) {
        handleWebError(err, res);
    } else {
        console.error(err); // Log the error for debugging
        sendError(res, buildWebError(500, "Internal Server Error"));
    }
}

export function sendSuccess(res: any, data: any, code:number = 200): void {
    res.status(code).json({
        success: true,
        data: data
    }
    );
}

export function sendError(res: any, error: WebError): void {
    res.status(error.status).json({
        success: false,
        error: error.message
    });
}