import { NextFunction, Request, Response } from "express";
import { readFile } from "fs/promises";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import createCustomError from "../../utils/createCustomError/createCustomError";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const supabaseUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { image } = req.body;

  const imagePath = path.join("uploads", image);

  try {
    const fileData = await readFile(imagePath);

    const storage = supabase.storage.from("images");

    const uploadResult = await storage.upload(imagePath, fileData);

    if (uploadResult.error) {
      next(uploadResult.error);
      return;
    }

    const { publicURL } = storage.getPublicUrl(imagePath);

    req.body.backupImage = publicURL;
    next();
  } catch (error) {
    const newError = createCustomError(
      404,
      "Couldn't upload or read the image",
      "Error while reading and uploading the image"
    );
    next(newError);
  }
};

export default supabaseUpload;
