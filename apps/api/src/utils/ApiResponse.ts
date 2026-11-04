class ApiResponse {
   public readonly statuscode: number;
   public readonly data: unknown;
   public readonly message: string;
   public readonly success: boolean;

   constructor(statuscode: number, data: unknown, message: string, success: boolean = true) {
      this.statuscode = statuscode;
      this.data = data;
      this.message = message;
      this.success = success;
   }
}

export { ApiResponse };
