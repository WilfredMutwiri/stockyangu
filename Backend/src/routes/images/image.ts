import { Response, Router } from "express";
import { ApiResponseType } from "../../types/api";
import { utapi } from "../../uploadthing";

const imageRouter = Router({
  mergeParams: true,
});

imageRouter.delete("/", async (req, res: Response<ApiResponseType<null>>) => {
  try {
    // return not implemented, until we have a use case
    // it is a security risk to allow deleting files since user can delete files of other users untill we mitigate that
    return res.status(501).json({
      success: false,
      message: "Not implemented",
      data: [],
    });

    // TODO: Why is it throwing a type error?
    // @ts-expect-error
    const key = req.params.key;

    console.log(`Deleting file with key: ${key}`);

    if (typeof key !== "string") {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid file key.",
        data: [
          {
            code: "custom",
            message: "File Key is required",
            path: ["key"],
          },
        ],
      });
    }

    const resp = await utapi.deleteFiles([key]);

    if (resp.success) {
      return res.json({
        success: true,
        message: "File deleted successfully.",
        data: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete file.",
      data: [],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      data: [],
    });
  }
});

export default imageRouter;
