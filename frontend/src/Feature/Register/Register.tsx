import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import styles from "./Register.module.css";
import { RegisterAPI } from "../../Shared/api";
import { toast, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Experience = {
  title: string;
  company: string;
  years: number;
  description: string;
};

type FormValues = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  companyName?: string;
  bio?: string;
  skills?: string;
  profilePicture?: FileList;
  experience: Experience[];
};

export default function Register() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty, isValid },
  } = useForm<FormValues>({
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      companyName: "",
      bio: "",
      skills: "",
      experience: [{ title: "", company: "", years: 0, description: "" }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
      if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB", { position: 'top-right', autoClose: 2000, transition: Bounce });
        return;
      }
  setPreview(URL.createObjectURL(file));
  setSelectedFile(file);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
  // show loader
  setIsSubmitting(true);
  // clear previous errors (toasts used instead)
      const formData = new FormData();
      formData.append("fullName", data.fullName.trim());
      formData.append("username", data.username.trim());
      formData.append("email", data.email.trim());
      formData.append("password", data.password);
      if (data.companyName?.trim()) formData.append("companyName", data.companyName.trim());
      if (data.bio?.trim()) formData.append("bio", data.bio.trim());
      if (data.skills?.trim()) formData.append("skills", data.skills.trim());
      // Prefer the locally tracked selectedFile (more reliable than react-hook-form file value)
      const fileToAppend = selectedFile || (data.profilePicture && data.profilePicture.length > 0 ? data.profilePicture[0] : null);
      if (fileToAppend) {
        formData.append("profilePicture", fileToAppend);
      }
      if (data.experience?.length) {
        const validExperience = data.experience.filter(
          (e) => e.title && e.company && (e.years || e.years === 0)
        );
        if (validExperience.length) {
          formData.append("experience", JSON.stringify(validExperience));
        }
      }

      // Log FormData for debugging
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await RegisterAPI(formData);
      if (response?.data) {
        const { userToken, user, message } = response.data;
        localStorage.setItem("jwt", userToken);
        localStorage.setItem("isLoggedIn", "true");
        if (user?._id) {
          localStorage.setItem("userId", user._id);
        }
        toast.success(message || 'Registration successful', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Zoom,
        });
        navigate("/");
      } else {
        throw new Error("Registration failed: No response data");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      const message = err.response?.data?.message || "Failed to register. Please try again.";
  toast.error(message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <header className={styles.header}>
          <h1 className={styles.brand}>TalentCrew</h1>
          <p className={styles.tagline}>Create your talent profile — connect with opportunities.</p>
        </header>
        <div className={styles.avatarSection}>
          <label className={styles.avatarLabel}>
            <input
              type="file"
              accept="image/*"
              className={styles.hiddenInput}
              {...register("profilePicture")}
              onChange={handleImageChange}
            />
            {preview ? (
              // preview image
              <img src={preview} alt="Preview" className={styles.avatar} />
            ) : (
              <div className={styles.avatarPlaceholder}>+ Add Photo</div>
            )}
          </label>
        </div>

        <div className={styles.inputRow}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Full Name *</label>
            <input
              className={styles.input}
              {...register("fullName", { required: "Full name is required" })}
              autoComplete="name"
            />
            {errors.fullName && isDirty && <span className={styles.error}>{errors.fullName.message}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Username *</label>
            <input
              className={styles.input}
              {...register("username", { required: "Username is required" })}
              autoComplete="username"
            />
            {errors.username && isDirty && <span className={styles.error}>{errors.username.message}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email *</label>
            <input
              className={styles.input}
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
              })}
              autoComplete="email"
            />
            {errors.email && isDirty && <span className={styles.error}>{errors.email.message}</span>}
          </div>
        </div>

        <div className={styles.inputRow}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Password *</label>
            <input
              type="password"
              autoComplete="new-password"
              className={styles.input}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 4, message: "At least 4 characters" },
              })}
            />
            {errors.password && isDirty && <span className={styles.error}>{errors.password.message}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Company Name</label>
            <input className={styles.input} {...register("companyName")} />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Skills (comma separated)</label>
            <input
              className={styles.input}
              {...register("skills")}
              placeholder="e.g. React, Node.js, Python"
            />
          </div>
        </div>

        <div className={styles.inputGroup + ' ' + styles.inputGroupFull}>
          <label className={styles.label}>Bio</label>
          <textarea rows={4} className={styles.textarea} {...register("bio")} />
        </div>

        <div className={styles.experienceSection}>
          <div className={styles.experienceHeader}>
            <h3 className={styles.sectionTitle}>Add Experience</h3>
            <button
              type="button"
              onClick={() => append({ title: "", company: "", years: 0, description: "" })}
              className={styles.addButton}
            >
              + Add
            </button>
          </div>
          {fields.map((field, idx) => (
            <div className={styles.experienceCard} key={field.id}>
              <div className={styles.cardHeader}>
                <h4>Experience {idx + 1}</h4>
                <button type="button" onClick={() => remove(idx)} className={styles.removeButton}>
                  Remove
                </button>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Title</label>
                  <input
                    className={styles.input}
                    {...register(`experience.${idx}.title` as const)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Company</label>
                  <input
                    className={styles.input}
                    {...register(`experience.${idx}.company` as const)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Years</label>
                  <input
                    type="number"
                    className={styles.input}
                    {...register(`experience.${idx}.years` as const, { valueAsNumber: true })}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Description</label>
                  <textarea
                    rows={3}
                    className={styles.textarea}
                    {...register(`experience.${idx}.description` as const)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={!isDirty || !isValid || isSubmitting}
        >
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </button>
        <p className={styles.footer}>
          Already have an account? <Link className={styles.link} to="/login">Log In</Link>
        </p>
      </form>
    </div>
  );
}