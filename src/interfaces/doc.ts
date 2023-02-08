import { z } from "zod";
import { Handler, HandlerType } from "./handler";

export interface TDoc extends Handler {
    group: string;
    type: HandlerType.endpoint;
    input?: z.ZodTypeAny;
    output?: z.ZodTypeAny;
  }