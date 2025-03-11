import { Metadata } from 'next';
import { UpdatePasswordForm } from '@/components/UpdatePasswordForm';

export const metadata: Metadata = {
  title: 'Settings - Update Password',
  description: 'Update your account password',
};

export default function PasswordSettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-md mx-auto">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Update Password</h3>
            <p className="text-sm text-muted-foreground">
              Change your account password. Make sure it's secure and unique.
            </p>
          </div>
          <UpdatePasswordForm />
        </div>
      </div>
    </div>
  );
} 