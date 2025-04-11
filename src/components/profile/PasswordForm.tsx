'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordFormProps {
  onSubmit: SubmitHandler<PasswordFormData>;
  disabled?: boolean;
}

export default function PasswordForm({ onSubmit, disabled }: PasswordFormProps) {
  const [showPasswords, setShowPasswords] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PasswordFormData>();

  const newPassword = watch('newPassword');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="currentPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Current Password
        </label>
        <div className="mt-1">
          <input
            type={showPasswords ? 'text' : 'password'}
            id="currentPassword"
            {...register('currentPassword', { required: 'Current password is required' })}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            disabled={disabled}
          />
          {errors.currentPassword && (
            <p className="mt-2 text-sm text-red-600">
              {errors.currentPassword.message as string}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium text-gray-700"
        >
          New Password
        </label>
        <div className="mt-1">
          <input
            type={showPasswords ? 'text' : 'password'}
            id="newPassword"
            {...register('newPassword', {
              required: 'New password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
              },
            })}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            disabled={disabled}
          />
          {errors.newPassword && (
            <p className="mt-2 text-sm text-red-600">
              {errors.newPassword.message as string}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm New Password
        </label>
        <div className="mt-1">
          <input
            type={showPasswords ? 'text' : 'password'}
            id="confirmPassword"
            {...register('confirmPassword', {
              required: 'Please confirm your new password',
              validate: (value) =>
                value === newPassword || 'Passwords do not match',
            })}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            disabled={disabled}
          />
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-600">
              {errors.confirmPassword.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="showPasswords"
          checked={showPasswords}
          onChange={(e) => setShowPasswords(e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label
          htmlFor="showPasswords"
          className="ml-2 block text-sm text-gray-900"
        >
          Show passwords
        </label>
      </div>

      <div>
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Change Password
        </button>
      </div>
    </form>
  );
} 