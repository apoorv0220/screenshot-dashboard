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
        <div>
            <h2>Screenshots by Session</h2>
            {Object.entries(groupedScreenshots).map(([sessionId, sessionScreenshots]) => (
                <div key={sessionId} style={{marginBottom: '20px'}}>
                    <h3>Session: {sessionId}</h3>
                    <div style={{display: 'flex', overflowX: 'auto', padding: '10px 0'}}>
                        {sessionScreenshots.map((screenshot) => (
                            <div key={screenshot._id as Key} style={{margin: '0 10px', flexShrink: 0}}>
                                <Image
                                    src={screenshot.url}
                                    alt={`Screenshot ${screenshot._id}`}
                                    width={200}
                                    height={150}
                                    style={{objectFit: 'cover', borderRadius: '8px'}}
                                />
                                <p style={{fontSize: '0.8em', color: '#555'}}>
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