import { Request, Response, Router } from "express";
import multer from "multer"; // for file upload handling
import { UTFile } from "uploadthing/server";
import { UploadedFileData } from "uploadthing/types";
import { ApiResponseType } from "../../types/api";
import { utapi } from "../../uploadthing";
import imageRouter from "./image";

const imagesRouter = Router();

imagesRouter.use("/:key", imageRouter);

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

imagesRouter.post(
  "/",
  upload.single("image"), // expects a form field named 'image'
  async (req: Request, res: Response<ApiResponseType<UploadedFileData>>) => {
    try {
      // Check if file is uploaded
      if (!req.file) {
        return res.status(400).json({
          data: [
            // ZodIssue
            {
              path: ["image"],
              code: "custom",
              message: "Image file is required",
            },
          ],
          message: "The `image` field is required and must be an image file",
          success: false,
        });
      }

      // check it is image, and less than 5MB
      if (!req.file.mimetype.startsWith("image")) {
        return res.status(400).json({
          data: [
            // ZodIssue
            {
              code: "custom",
              message: "Only image files are allowed",
              path: ["image"],
            },
          ],
          message: "Only image files are allowed. Please upload an image file.",
          success: false,
        });
      }
      if (req.file.size > 5 * 1024 * 1024) {
        return res.status(400).json({
          data: [
            // ZodIssue
            {
              code: "custom",
              message: "Image file size should be less than 5MB",
              path: ["image"],
            },
          ],
          message:
            "Image file size should be less than 5MB. Please upload a smaller image.",
          success: false,
        });
      }

      // Get the uploaded image buffer or original data
      const image = req.file;
      // new UTFile(["foo"], "foo.txt", { customId: "foo" });
      const utImage = new UTFile([image.buffer], image.originalname, {});
      console.log(image.originalname, image.size);

      // Upload the image using utapi
      console.log("Uploading file to utapi...");
      const response = await utapi.uploadFiles(utImage);
      console.log("File uploaded to utapi:", response);

      // was it a failure?
      if (response.error) {
        return res.status(500).json({
          success: false,
          message: `${response.error.code}: ${response.error.message}`,
          data: [],
        });
      }

      // return the response
      return res.json({
        success: true,
        message: "File uploaded successfully",
        data: response.data,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error. Please retry.",
        data: [],
      });
    }
  }
);

export default imagesRouter;
