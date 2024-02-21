class AppError extends Error {
  status: string;
  isOperational: boolean;

  constructor(message: string, public statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this);
  }
}

export default AppError;
