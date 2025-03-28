import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import dbConnect from '../../lib/mongodb';
import Screenshot from '../../models/Screenshot';
import { CloudinaryResponseType, ScreenshotCreateType } from '../../models/Screenshot';
import mongoose from "mongoose";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
    const data = await request.formData();
    const file: File | null = data.get('image') as unknown as File;
    const sessionId = data.get('sessionId') as string;

    if (!file) {
        return NextResponse.json({ success: false });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
        const uploadedResponse = await new Promise<CloudinaryResponseType>((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image' }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result as CloudinaryResponseType);
                }
            }).end(buffer);
        });

        const imageUrl = uploadedResponse.secure_url;

        if (mongoose.connection.readyState !== 1) {
            console.warn("Database connection not established. Attempting to connect...");
            try {
                await dbConnect();
                console.log("Database connection established successfully.");
            } catch (dbError) {
                console.error("Error connecting to database:", dbError);
                return NextResponse.json({ success: false, error: "Failed to connect to database" }, { status: 500 });
            }
        }


        const newScreenshotData: ScreenshotCreateType = {
            sessionId: sessionId,
            url: imageUrl,
            timestamp: new Date(),
        };

        const newScreenshot = new Screenshot(newScreenshotData);
        await newScreenshot.save();

        return NextResponse.json({ success: true, imageUrl: imageUrl });
    } catch (error) {
        console.error("Cloudinary/MongoDB error:", error);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return NextResponse.json({ success: false, error: (error as any).message }, { status: 500 });
    }
}