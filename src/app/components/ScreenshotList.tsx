import Image from 'next/image';
import { ScreenshotType } from '../models/Screenshot';
import { Key } from 'react';
import React from "react";

interface ScreenshotListProps {
    screenshots: ScreenshotType[];
}

const ScreenshotList: React.FC<ScreenshotListProps> = ({screenshots}) => {
    const groupedScreenshots = groupScreenshotsBySession(screenshots);

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-teal-500">Screenshots by Session</h2>
            {Object.entries(groupedScreenshots).map(([sessionId, sessionScreenshots]) => (
                <div key={sessionId} className="mb-6 p-4 border border-gray-700 rounded-md">
                    <h3 className="text-xl font-semibold mb-2 text-teal-300">Session: {sessionId}</h3>
                    <div className="flex overflow-x-auto py-2">
                        {sessionScreenshots.map((screenshot) => (
                            <div key={screenshot._id as Key} className="mr-4 flex-shrink-0">
                                <Image
                                    src={screenshot.url}
                                    alt={`Screenshot ${screenshot._id}`}
                                    width={200}
                                    height={150}
                                    style={{objectFit: 'cover', borderRadius: '8px'}}
                                    className="border border-gray-700 rounded-md"
                                />
                                <p className="text-sm text-gray-400 mt-1">
                                    {new Date(screenshot.timestamp).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

const groupScreenshotsBySession = (screenshots: ScreenshotType[]) => {
    return screenshots.reduce((acc: { [key: string]: ScreenshotType[] }, screenshot: ScreenshotType) => {
        const sessionId = screenshot.sessionId;
        if (!acc[sessionId]) {
            acc[sessionId] = [];
        }
        acc[sessionId].push(screenshot);
            return acc;
        }, {});
    };

export default ScreenshotList;