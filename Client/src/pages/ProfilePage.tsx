import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import EmptyState from '../components/EmptyState';
import EditProfileModal from '../components/EditProfileModal';
import { mockSavedProjects } from '../utils/mockProjects';
import type { Project, ProfileData } from '../types';
import defaultAvatar from '../assets/user-avatar-placeholder.svg';
import './ProfilePage.css';

// TODO: replace defaultAvatar with the existing man/user icon already used
// elsewhere on the site (e.g. the one shown in the Navbar).

function ProfilePage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<ProfileData>({
    name: 'Isha',
    email: 'isha@example.com',
    avatarUrl: defaultAvatar,
  });

  const [savedProjects, setSavedProjects] = useState<Project[]>(mockSavedProjects);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleRemoveProject = (id: string) => {
    setSavedProjects((prev) => prev.filter((project) => project.id !== id));
  };

  const handleSaveProfile = (updated: ProfileData) => {
    setProfile(updated);
    setIsEditOpen(false);
  };

  // TODO: point this at the existing project discovery / dashboard route.
  const handleExploreProjects = () => {
    navigate('/dashboard');
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <header className="profile-header">
          <div className="profile-avatar-wrap">
            <img
              src={profile.avatarUrl}
              alt={`${profile.name}'s profile picture`}
              className="profile-avatar"
            />
          </div>
          <h1 className="profile-name">{profile.name}</h1>
          <p className="profile-email">{profile.email}</p>
          <button
            type="button"
            className="profile-btn profile-btn-primary"
            onClick={() => setIsEditOpen(true)}
          >
            Edit Profile
          </button>
        </header>

        <section className="profile-info-card">
          <div className="profile-info-row">
            <img
              src={profile.avatarUrl}
              alt=""
              aria-hidden="true"
              className="profile-info-avatar"
            />
            <div className="profile-info-details">
              <div className="profile-info-item">
                <span className="profile-info-label">Name</span>
                <span className="profile-info-value">{profile.name}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-label">Email Address</span>
                <span className="profile-info-value">{profile.email}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="profile-btn profile-btn-secondary"
            onClick={() => setIsEditOpen(true)}
          >
            Edit Profile
          </button>
        </section>

        <section className="profile-projects-section">
          <h2 className="profile-section-title">Saved Projects</h2>

          {savedProjects.length === 0 ? (
            <EmptyState onExplore={handleExploreProjects} />
          ) : (
            <div className="profile-projects-grid">
              {savedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onRemove={handleRemoveProject}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {isEditOpen && (
        <EditProfileModal
          profile={profile}
          onSave={handleSaveProfile}
          onClose={() => setIsEditOpen(false)}
        />
      )}
    </div>
  );
}

export default ProfilePage;
