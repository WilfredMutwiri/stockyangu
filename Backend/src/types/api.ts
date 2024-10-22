import { ZodIssue } from "zod";

export type ApiResponseType<TData, TError = ZodIssue[]> =
  | {
      success: true;
      message: string;
      data: TData;
    }
  | {
      success: false;
      message: string;
      data: TError;
    };
