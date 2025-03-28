import React from 'react';
import ReactMarkdown from 'react-markdown';

interface SummaryProps {
    summary: string;
}

const Summary: React.FC<SummaryProps> = ({ summary }) => {
    return (
        <div className="p-4 border border-gray-700 rounded-md bg-gray-800 shadow-md">
            <h2 className="text-2xl font-semibold mb-2 text-teal-500 font-mono">AI Summary</h2>
            <ReactMarkdown>
                {summary || 'No summary available.'}
            </ReactMarkdown>
        </div>
    );
};

export default Summary;