import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../../config/URLAPI";

export function useProfileLogic(loggedInId: string | null) {
  const [user, setUser] = useState<any>(null);
  const [editData, setEditData] = useState({ companyName: "", bio: "" });
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [experience, setExperience] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectForm, setProjectForm] = useState({ title: "", description: "", link: "", imageUrl: "" });
  const [expForm, setExpForm] = useState({
    title: "",
    company: "",
    years: "",
    description: "",
  });
  const [expError, setExpError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Always show logged-in user's profile
  const profileId = loggedInId;

  useEffect(() => {
    if (!profileId) {
      setError("No user ID found. Please log in again.");
      setLoading(false);
      return;
    }
    async function fetchUser() {
      setLoading(true);
      try {
        const res = await axios.get(
          `${API_BASE}/api/user/user-info/${profileId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
          }
        );
        if (!res.data.user) throw new Error("No user data returned");
        setUser(res.data.user);
        setEditData({
          companyName: res.data.user.companyName || "",
          bio: res.data.user.bio || "",
        });
        setSkills(res.data.user.skills || []);
        setExperience(res.data.user.experience || []);
  setProjects(res.data.user.projects || []);
      } catch (err: any) {
        setError(
          "Failed to load user profile. " +
            (err?.response?.data?.message || err.message)
        );
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [profileId, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditData((curr) => ({ ...curr, [e.target.name]: e.target.value }));
  };

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleSave = async () => {
    if (!loggedInId) {
      setError("No user ID found. Please log in again.");
      return;
    }
    try {
      setLoading(true);
      await axios.put(
        `${API_BASE}/api/user/user-info/${loggedInId}`,
        { ...editData, skills, experience, projects },
        { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` } }
      );
      setUser((prev: any) => ({ ...prev, ...editData, skills, experience, projects }));
      setIsEditing(false);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err: any) {
      setError(
        "Failed to update profile. " +
          (err?.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Project handlers
  const onProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProjectForm((curr) => ({ ...curr, [e.target.name]: e.target.value }));
  };
  const onProjectAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title.trim()) return;
    setProjects([...projects, { ...projectForm }]);
    setProjectForm({ title: "", description: "", link: "", imageUrl: "" });
  };
  const onProjectRemove = (idx: number) => {
    setProjects(projects.filter((_, i) => i !== idx));
  };

  // Skills logic
  const handleSkillAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const skill = newSkill.trim();
    if (!skill || skills.includes(skill)) return;
    setSkills([...skills, skill]);
    setNewSkill("");
  };
  const handleSkillRemove = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  // Experience logic
  const handleExpChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setExpForm((curr) => ({ ...curr, [e.target.name]: e.target.value }));
  };
  const handleExpAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expForm.title || !expForm.company || !expForm.years || isNaN(Number(expForm.years))) {
      setExpError("All fields required and years must be a number");
      return;
    }
    setExperience([...experience, { ...expForm, years: Number(expForm.years) }]);
    setExpForm({ title: "", company: "", years: "", description: "" });
    setExpError("");
  };
  const handleExpRemove = (idx: number) => {
    setExperience(experience.filter((_, i) => i !== idx));
  };

  return {
    user,
    setUser,
    editData,
    setEditData,
    skills,
    setSkills,
    newSkill,
    setNewSkill,
    experience,
    setExperience,
    expForm,
    setExpForm,
    expError,
    setExpError,
    isEditing,
    setIsEditing,
    loading,
    setLoading,
    error,
    setError,
    success,
    setSuccess,
    handleChange,
    toggleEdit,
    handleSave,
    handleSkillAdd,
    handleSkillRemove,
    handleExpChange,
    handleExpAdd,
    handleExpRemove,
  projects,
  setProjects,
  projectForm,
  setProjectForm,
  onProjectChange,
  onProjectAdd,
  onProjectRemove,
  };
}
