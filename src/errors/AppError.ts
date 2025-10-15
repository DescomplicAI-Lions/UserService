export class AppError extends Error {
    public readonly status: number; // HTTP status code
    public readonly code: string;   // Machine-readable error code
    public readonly details?: any;  // Detalhes opcionais a mais
  
    constructor(
      message: string,
      code: string,
      status: number = 500,
      details?: any,
    //   options?: ErrorOptions
    ) {
      super(message);
      this.name = 'AppError'; // Nome do error
      this.status = status;
      this.code = code;
      this.details = details;
  
      Object.setPrototypeOf(this, AppError.prototype);
    }
  }