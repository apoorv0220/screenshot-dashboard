import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { writeFile } from 'fs/promises';
import {getSession} from "next-auth/react"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//In memory storage (Replace with your database)
const screenshots:any = []

export async function POST(request: Request) {
  const data = await request.formData();
  const file: File | null = data.get('image') as unknown as File
  const sessionId = data.get('sessionId') as string;
  const email = data.get('email') as string;


  if (!file) {
    return NextResponse.json({ success: false })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

    // Upload the image to Cloudinary
    try {
        const uploadedResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image' }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }).end(buffer);
        });

        const timestamp = new Date().toISOString();

        //In memory storage (Replace with your database)
        screenshots.push({
          email: email,
          sessionId: sessionId,
          url: (uploadedResponse as any).secure_url,
          timestamp: timestamp
        })


        return NextResponse.json({ success: true, imageUrl: (uploadedResponse as any).secure_url });
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return NextResponse.json({ success: false, error: (error as any).message }, { status: 500 });
    }


}