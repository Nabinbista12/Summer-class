# Summer Class Project — TalentCrew 🚀

Live demo: https://summer-class-proj.onrender.com

GitHub repo: https://github.com/Nabinbista12/Summer-class

## Short description

this is the summer class project amkind hwile learning sumer clas frm the colelge 🎓

## Quick links
- Live: https://summer-class-proj.onrender.com 🌐
- Repo: https://github.com/Nabinbista12/Summer-class 📦

## Local development

If you want to run the project locally, make sure to point the frontend at your local API. In this project the API base is defined in the frontend API file — if you are using the app locally, set the API to `dev` in the api file (for example: `frontend/src/Shared/api.tsx`) so the app uses your local backend.

Typical steps (PowerShell):

```powershell
cd backend
npm install
# set up .env (copy backend/.env.example or create .env)
# start backend (your project may use `npm run dev` or `npm start`)
npm run dev

cd ../frontend
npm install
# start frontend (Vite)
npm run dev
```

Notes:
- Ensure MongoDB and any external services (Cloudinary) are configured in `backend/.env` if you use them.
- When running locally, point the frontend API base to your local backend by using the `dev` setting in `frontend/src/Shared/api.tsx` (or update the environment variable you use for API URL).

## Tools & libraries used 🛠️

- Node.js & npm
- Express
- MongoDB & Mongoose
- Cloudinary (image uploads)
- React + TypeScript
- Vite
- Axios
- react-router
- react-hook-form
- react-toastify
- Font Awesome (icons)

---

If you want this README expanded (screenshots, contribution guide, or exact run commands detected from package.json), tell me and I will add them. 👍
