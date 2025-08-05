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

export const LoginAPI = async (formData: { username: string; password: string }) => {
  try {
    const res = await axios.post("http://localhost:3000/api/auth/login", formData);

    localStorage.setItem("jwt", res.data.userToken);
    localStorage.setItem("isLoggedIn", "true");

    return res.data;
  } catch (err) {
    console.log("Error while login", err);
  }
};


export const RegisterAPI = (formData: {
  username: String;
  email: String;
  password: String;
}) => {
  try {
    return axios.post("http://localhost:3000/api/auth/register", formData, {
      withCredentials: true,
    });
  } catch (err) {
    console.log("Error while login", err);
  }
};