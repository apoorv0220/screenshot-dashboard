'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProfilePictureProps {
  image: string | null;
  onUpdate: () => void;
  disabled?: boolean;
}

export default function ProfilePicture({ image, onUpdate, disabled }: ProfilePictureProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/profile/picture', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      await onUpdate();
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center space-x-6">
      <div className="flex-shrink-0">
        {image ? (
          <div className="relative h-24 w-24">
            <Image
              src={image}
              alt="Profile"
              fill
              className="rounded-full object-cover"
            />
          </div>
        ) : (
          <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image</span>
          </div>
        )}
      </div>
      <div>
        <label
          htmlFor="profile-picture"
          className="block text-sm font-medium text-gray-700"
        >
          Profile Picture
        </label>
        <div className="mt-1">
          <input
            type="file"
            id="profile-picture"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={disabled || isUploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          JPG, GIF or PNG. Max size of 1MB.
        </p>
      </div>
    </div>
  );
} 