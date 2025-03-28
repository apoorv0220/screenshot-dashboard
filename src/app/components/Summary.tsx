import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from "next/image";

interface AnalysisItem {
    url: string;
    timestamp: string;
    analysis: string;
}

interface SummaryProps {
    summary: AnalysisItem[];
}

const Summary: React.FC<SummaryProps> = ({ summary }) => {
    return (
        <div className="p-4 border border-gray-700 rounded-md bg-gray-800 shadow-md">
            <h2 className="text-2xl font-semibold mb-2 text-teal-500 font-mono">AI Summary</h2>
            {summary.map((item, index) => (
                <div key={index} className="mb-4">
                    <div className="flex items-center mb-2">
                        <Image
                            src={item.url}
                            alt={`Screenshot ${index + 1}`}
                            width={200}
                            height={150}
                            style={{ objectFit: 'cover', borderRadius: '8px' }}
                            className="border border-gray-700 rounded-md shadow-md mr-4"
                        />
                        <div>
                            <p className="text-sm text-gray-400 font-mono">
                                {new Date(item.timestamp).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div className="text-gray-300 font-mono">
                      <ReactMarkdown>
                          {item.analysis}
                      </ReactMarkdown>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Summary;