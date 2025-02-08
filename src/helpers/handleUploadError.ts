// import multer from "multer";
// import { Request, Response, NextFunction } from "express";
// import { CustomError } from "./CustomError";

// export const handleUploadErrors = (err: unknown) => {
//   if (err instanceof multer.MulterError) {
//     let message = "File upload error";
//     let statusCode = 400;
//       const errors: { [key: string]: string[] } = {};
//       console.log(err);

//     switch (err.code) {
//       case "LIMIT_FILE_SIZE":
//         message = "File size too large. Max limit is 5MB.";
//         errors["fileSize"] = [message];
//         break;
//       case "LIMIT_FILE_COUNT":
//         message = "Too many files uploaded. Max limit is 20.";
//         errors["fileCount"] = [message];
//         break;
//       case "LIMIT_UNEXPECTED_FILE":
//         message = "Unexpected file type or field.";
//         errors["unexpectedFile"] = [message];
//         break;
//       default:
//         errors["multer"] = [err.message];
//     }

//     throw new CustomError(message, statusCode, errors);
//   }

//   if (err instanceof Error) {
//     throw new CustomError(err.message, 500);
//   }
// };
