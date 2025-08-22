import axios from "axios";

// export const LoginAPI = (formData: { username: String; password: String }) => {
//   try {
//     const res = axios.post("http://localhost:3000/api/auth/login", formData, {
//       withCredentials: true,
//     });
//     localStorage.setItem("jwt", res.data.userToken);
//     return res.data;
//   } catch (err) {
//     console.log("Error while login", err);
//   }
// };

export const LoginAPI = async (formData: {
  username: string;
  password: string;
}) => {
  try {
    const res = await axios.post(
      "http://localhost:3000/api/auth/login",
      formData
    );

    localStorage.setItem("jwt", res.data.userToken);
    localStorage.setItem("isLoggedIn", "true");
    if (res.data.user && res.data.user._id) {
      localStorage.setItem("userId", res.data.user._id);
    }

    return res.data;
  } catch (err) {
    console.log("Error while login", err);
  }
};

export const RegisterAPI = (formData: FormData) => {
  try {
    // Let axios set Content-Type (with boundary) automatically
    return axios.post("http://localhost:3000/api/auth/register", formData, {
      withCredentials: true,
    });
  } catch (err) {
    console.log("Error while register", err);
    throw err;
  }
};

// export const uploadProfilePictureAPI = async (formData: FormData) => {
//   try {
//     const token = localStorage.getItem("jwt");
//     const response = await axios.post(
//       "http://localhost:3000/api/auth/profile-picture",
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Upload error:", error);
//     throw error;
//   }
// };
