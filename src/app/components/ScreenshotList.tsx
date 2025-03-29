"use client";
import Image from "next/image";
import { ScreenshotType } from "../models/Screenshot";
import { Key, useState } from "react";
import React from "react";

interface ScreenshotListProps {
  screenshots: ScreenshotType[];
}

const ScreenshotList: React.FC<ScreenshotListProps> = ({ screenshots }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-teal-500">Screenshots</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {screenshots.map((screenshot) => (
          <div key={screenshot._id as Key} className="relative">
            <Image
              src={screenshot.url}
              alt={`Screenshot ${screenshot._id}`}
              width={400}
              height={300}
              style={{ objectFit: "cover", borderRadius: "8px" }}
              className="border-2 border-gray-700 rounded-md shadow-md cursor-pointer transition duration-200 hover:scale-105"
              onClick={() => handleImageClick(screenshot.url)}
            />
            <p className="text-sm text-gray-400 mt-1 font-mono">
              {new Date(screenshot.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

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

export default ScreenshotList;
