import { HttpError } from "http-errors";
import { ErrorResponse } from "@/common/middlewares/error-handler";

const httpErrorAdapter = (error: HttpError): ErrorResponse => {
  return {
    name: error.name,
    code: error.statusCode,
    errors: [
      {
        message: error.message,
        path: "",
      },
    ],
  };
};

export default httpErrorAdapter;
