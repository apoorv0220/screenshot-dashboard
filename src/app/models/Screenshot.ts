import { Schema, model, models, Document, Model } from "mongoose";

interface ScreenshotDocument extends Document {
  sessionId: string;
  url: string;
  timestamp: Date;
}

interface ScreenshotCreateDocument {
  sessionId: string;
  url: string;
  timestamp: Date;
}

interface CloudinaryResponse {
  secure_url: string;
}

const ScreenshotSchema = new Schema({
  sessionId: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ScreenshotModel: Model<ScreenshotDocument> =
  models.Screenshot ||
  model<ScreenshotDocument>("Screenshot", ScreenshotSchema);

export type ScreenshotType = ScreenshotDocument;
export type CloudinaryResponseType = CloudinaryResponse;
export type ScreenshotCreateType = ScreenshotCreateDocument;
export default ScreenshotModel;
