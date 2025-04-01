import multer from "multer";

const storage = multer.diskStorage({});
export const uploadM = multer({ storage });
