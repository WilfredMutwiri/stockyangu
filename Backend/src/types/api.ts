import { ZodIssue } from "zod";

export type ApiResponseType<TData, TError = ZodIssue[]> =
  | {
      success: true;
      message: string;
      data: TData;
      pagination?: {
        items_count: number;
        pages_count: number;
        current_page: number;
        has_next: boolean;
        has_prev: boolean;
        links: {
          next: string | null;
          prev: string | null;
          self: string;
        };
      };
    }
  | {
      success: false;
      message: string;
      data: TError;
    };
