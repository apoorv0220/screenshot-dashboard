import {NextResponse} from 'next/server';
import dbConnect from '../../lib/mongodb';
import Screenshot from '../../models/Screenshot';

export async function GET(request: Request) {
    try {
        await dbConnect();

        const {searchParams} = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '5', 10);
        const screenshotsPerSession = parseInt(searchParams.get('screenshotsPerSession') || '3', 10);

        const skip = (page - 1) * limit;

        const uniqueSessionIds = await Screenshot.distinct('sessionId');

        const totalSessions = uniqueSessionIds.length;
        const totalPages = Math.ceil(totalSessions / limit);

        const paginatedSessionIds = uniqueSessionIds.slice(skip, skip + limit);

        const sessions = [];

        for (const sessionId of paginatedSessionIds) {
            const screenshots = await Screenshot.find({sessionId: sessionId})
                .sort({timestamp: 1})
                .limit(screenshotsPerSession);

            sessions.push({
                sessionId: sessionId,
                screenshots: screenshots.map(screenshot => ({
                    url: screenshot.url,
                    timestamp: screenshot.timestamp,
                }))
            });
        }

        return NextResponse.json({
            sessions: sessions,
            totalSessions: totalSessions,
            totalPages: totalPages,
            currentPage: page,
        });
    } catch (error) {
        console.error("Error fetching sessions:", error);
        return NextResponse.json({error: "Failed to fetch sessions"}, {status: 500});
    }
}