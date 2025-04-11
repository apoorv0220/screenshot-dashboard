import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const screenshot = formData.get('screenshot') as File;
        const sessionId = formData.get('sessionId') as string;
        const timestamp = formData.get('timestamp') as string;
        const platform = formData.get('platform') as string;
        const filename = formData.get('filename') as string;

        if (!screenshot || !sessionId || !timestamp) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validate file type and size
        if (screenshot.type !== 'image/png') {
            return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (screenshot.size > maxSize) {
            return NextResponse.json({ error: 'File too large' }, { status: 400 });
        }

        // Generate S3 key
        const s3Key = `screenshots/${session.user.id}/${sessionId}/${uuidv4()}.png`;

        // Upload to S3
        const buffer = Buffer.from(await screenshot.arrayBuffer());
        await s3Client.send(new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: s3Key,
            Body: buffer,
            ContentType: 'image/png',
            Metadata: {
                userId: session.user.id,
                sessionId,
                timestamp,
                platform,
                originalFilename: filename,
            },
        }));

        // Store metadata in database
        await prisma.screenshot.create({
            data: {
                userId: session.user.id,
                sessionId,
                timestamp: new Date(timestamp),
                s3Key,
                platform,
                originalFilename: filename,
            },
        });

        return NextResponse.json({ success: true, s3Key });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 