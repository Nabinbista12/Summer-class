import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";
import styles from "./Profile.module.css";
import ProfilePictureUpload from "./ProfilePictureUpload";
import ProfileForm from "./ProfileForm";
import SkillsSection from "./SkillsSection";
import ExperienceSection from "./ExperienceSection";
import ProfileDetailView from "./ProfileDetailView";
import { useProfileLogic } from "./ProfileLogic";

export default function Profile() {
  const loggedInId = localStorage.getItem("userId");
  const profile = useProfileLogic(loggedInId);

  if (profile.loading) {
    return (
      <div className={styles.profile}>
        <Navbar />
        <div className={styles.container}>Loading...</div>
        <Footer />
      </div>
    );
  }
  if (profile.error) {
    return (
      <div className={styles.profile}>
        <Navbar />
        <div className={styles.container}>{profile.error}</div>
        <Footer />
      </div>
    );
  }
  if (!profile.user) return null;

  return (
    <>
      <Navbar />
      <div className={styles.profile}>
        <div className={styles.container}>
          <div className={styles.profileCard}>
            <header className={styles.header}>
              <h1 className={styles.brand}>TalentCrew</h1>
              <p className={styles.tagline}>
                Your profile — keep it concise and up-to-date.
              </p>
            </header>
            {profile.isEditing ? (
              <ProfilePictureUpload
                profilePictureUrl={profile.user.profilePicture?.url}
                onUploadSuccess={(image) =>
                  profile.setUser((prev: any) => ({
                    ...prev,
                    profilePicture: image,
                  }))
                }
              />
            ) : null}
            <div className={styles.username}>{profile.user.username}</div>
            <div className={styles.email}>
              <strong>Email:</strong> {profile.user.email}
            </div>
            {profile.isEditing ? (
              <form
                className={styles.formContainer}
                onSubmit={(e) => e.preventDefault()}
              >
                <ProfileForm
                  editData={profile.editData}
                  onChange={profile.handleChange}
                  projects={profile.projects}
                  projectForm={profile.projectForm}
                  onProjectChange={profile.onProjectChange}
                  onProjectAdd={profile.onProjectAdd}
                  onProjectRemove={profile.onProjectRemove}
                />
                {/* --- Skills Section --- */}
                <SkillsSection
                  skills={profile.skills}
                  newSkill={profile.newSkill}
                  onSkillChange={(e) => profile.setNewSkill(e.target.value)}
                  onSkillAdd={profile.handleSkillAdd}
                  onSkillRemove={profile.handleSkillRemove}
                />
                {/* --- Experience Section --- */}
                <ExperienceSection
                  experience={profile.experience}
                  expForm={profile.expForm}
                  expError={profile.expError}
                  onExpChange={profile.handleExpChange}
                  onExpAdd={profile.handleExpAdd}
                  onExpRemove={profile.handleExpRemove}
                />
                <div className={styles.btnGroup}>
                  <button
                    type="button"
                    className={styles.saveBtn}
                    onClick={profile.handleSave}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={profile.toggleEdit}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <ProfileDetailView
                user={profile.user}
                onEdit={profile.toggleEdit}
              />
            )}
            {profile.success && (
              <div className={styles.successMsg}>{profile.success}</div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
