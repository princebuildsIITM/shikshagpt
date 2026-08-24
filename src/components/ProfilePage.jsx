import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "shikshagpt_profile";

const EXAM_OPTIONS = ["JEE", "NEET", "Board Exams", "Other"];
const GRADE_OPTIONS = ["9th", "10th", "11th", "12th", "Dropper"];

const EMPTY_PROFILE = { name: "", exam: "", grade: "", city: "" };

export default function ProfilePage() {
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [formData, setFormData] = useState(EMPTY_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  // Load on page open
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setProfile(parsed);
      setFormData(parsed);
      setHasProfile(true);
    } else {
      // No profile yet — go straight into edit/create mode
      setIsEditing(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.exam || !formData.grade || !formData.city.trim()) {
      alert("Please fill all fields before saving.");
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    setProfile(formData);
    setHasProfile(true);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setFormData(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-black px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <Link
            to="/"
            className="rounded-full border border-zinc-700 px-2.5 py-1 text-xs text-zinc-300 transition hover:border-[#F5C518] hover:text-[#F5C518] sm:px-3 sm:text-sm"
          >
            ← Home
          </Link>
          <h1 className="text-base font-bold text-[#F5C518] sm:text-lg">Your Profile</h1>
        </div>

        {/* Welcome message — only shown when profile exists and not editing */}
        {hasProfile && !isEditing && (
          <p className="mb-4 text-sm text-zinc-400">
            Welcome back, <span className="text-[#F5C518] font-semibold">{profile.name}</span>!
          </p>
        )}

        {!isEditing ? (
          // View mode
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6">
            <ProfileField label="Name" value={profile.name} />
            <ProfileField label="Exam" value={profile.exam} />
            <ProfileField label="Grade" value={profile.grade} />
            <ProfileField label="City" value={profile.city} />

            <button
              onClick={handleEditClick}
              className="mt-4 w-full rounded-full bg-[#F5C518] px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          // Edit / Create mode
          <form
            onSubmit={handleSave}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6"
          >
            <FormField
              label="Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Prince Kumar"
            />

            <FormSelect
              label="Exam"
              name="exam"
              value={formData.exam}
              onChange={handleChange}
              options={EXAM_OPTIONS}
            />

            <FormSelect
              label="Grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              options={GRADE_OPTIONS}
            />

            <FormField
              label="City"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Raxaul"
            />

            <div className="mt-5 flex gap-3">
              <button
                type="submit"
                className="flex-1 rounded-full bg-[#F5C518] px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
              >
                Save Profile
              </button>

              {hasProfile && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 rounded-full border border-zinc-700 px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-zinc-500"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// Small reusable pieces, kept in the same file for now
function ProfileField({ label, value }) {
  return (
    <div className="mb-3 last:mb-0">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="text-sm text-white">{value}</p>
    </div>
  );
}

function FormField({ label, name, type, value, onChange, placeholder }) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="mb-1 block text-xs uppercase tracking-wide text-zinc-500">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-zinc-700 bg-black px-3 py-2 text-sm text-white
                   outline-none placeholder-zinc-600 focus:border-[#F5C518]"
      />
    </div>
  );
}

function FormSelect({ label, name, value, onChange, options }) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="mb-1 block text-xs uppercase tracking-wide text-zinc-500">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-zinc-700 bg-black px-3 py-2 text-sm text-white
                   outline-none focus:border-[#F5C518]"
      >
        <option value="" disabled>
          Select {label.toLowerCase()}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
