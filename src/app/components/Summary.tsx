import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="p-4 border border-gray-700 rounded-md bg-gray-800 shadow-md">
      <h2 className="text-2xl font-semibold mb-2 text-teal-500 font-mono">
        AI Summary
      </h2>
      {summary.map((item, index) => (
        <div key={index} className="mb-4">
          <div
            className="flex items-center mb-2 cursor-pointer"
            onClick={() => handleImageClick(item.url)}
          >
            <Image
              src={item.url}
              alt={`Screenshot ${index + 1}`}
              width={200}
              height={150}
              style={{ objectFit: "cover", borderRadius: "8px" }}
              className="border border-gray-700 rounded-md shadow-md mr-4 hover:scale-105 transition duration-200"
            />
            <div>
              <p className="text-sm text-gray-400 font-mono">
                {new Date(item.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="text-gray-300 font-mono">
            <ReactMarkdown>{item.analysis}</ReactMarkdown>
          </div>
        </div>
      ))}
      {selectedImage && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="relative bg-gray-900 rounded-md p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt="Screenshot Preview"
              width={800}
              height={600}
              style={{ objectFit: "contain" }}
              className="border-2 border-teal-500 rounded-md shadow-lg"
            />
            <button
              className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Summary;
