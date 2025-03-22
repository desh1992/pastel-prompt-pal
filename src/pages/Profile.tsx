
import React from 'react';
import Header from '@/components/layout/Header';
import ProfilePage from '@/components/profile/ProfilePage';

const Profile = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ProfilePage />
      </main>
    </div>
  );
};

export default Profile;
