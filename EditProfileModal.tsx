import { useState } from 'react';
import type { FormEvent } from 'react';
import type { ProfileData } from './types';

interface EditProfileModalProps {
  profile: ProfileData;
  onSave: (updated: ProfileData) => void;
  onClose: () => void;
}

function EditProfileModal({ profile, onSave, onClose }: EditProfileModalProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    onSave({ ...profile, name: name.trim(), email: email.trim() });
  };

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div
        className="profile-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-heading"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="edit-profile-heading" className="profile-modal-title">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="profile-modal-form">
          <label className="profile-form-label" htmlFor="profile-name">
            Name
          </label>
          <input
            id="profile-name"
            type="text"
            className="profile-form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="profile-form-label" htmlFor="profile-email">
            Email Address
          </label>
          <input
            id="profile-email"
            type="email"
            className="profile-form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <p className="profile-form-error">{error}</p>}

          <div className="profile-modal-actions">
            <button
              type="button"
              className="profile-btn profile-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="profile-btn profile-btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
