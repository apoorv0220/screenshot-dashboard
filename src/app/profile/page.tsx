'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import ProfileForm from '@/components/profile/ProfileForm';
import ProfilePicture from '@/components/profile/ProfilePicture';
import PasswordForm from '@/components/profile/PasswordForm';
import DeleteAccount from '@/components/profile/DeleteAccount';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (!session) {
    router.push('/401');
    return null;
  }

  const handleProfileUpdate = async (data: { name: string; email: string }) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      await update();
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to change password');
      }

      toast.success('Password changed successfully');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to change password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountDelete = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/profile', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      await signOut({ callbackUrl: '/' });
      toast.success('Account deleted successfully');
    } catch (error) {
      toast.error('Failed to delete account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Profile Information
            </h3>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <ProfilePicture
                  image={session.user.image}
                  onUpdate={update}
                  disabled={isLoading}
                />
              </div>
              <div className="sm:col-span-6">
                <ProfileForm
                  initialData={{
                    name: session.user.name || '',
                    email: session.user.email || '',
                  }}
                  onSubmit={handleProfileUpdate}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Change Password
            </h3>
            <div className="mt-6">
              <PasswordForm onSubmit={handlePasswordChange} disabled={isLoading} />
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-red-900">
              Danger Zone
            </h3>
            <div className="mt-6">
              <DeleteAccount onDelete={handleAccountDelete} disabled={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 