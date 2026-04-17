# 🛠️ Admin Management Guide

This guide provides instructions for managing the Abhilash Tiwari Portfolio, including authorizing admin access and customizing the website's appearance.

---

## 🔑 1. How to Access the Admin Dashboard

The admin panel is located at the `/admin` route of your website.

1.  **Navigate** to: `https://your-domain.com/admin` (or `http://localhost:5173/admin` during development).
2.  **Login**: Click the **"Login with Google"** button.
3.  **Dashboard**: Once authorized, you can add new projects, hide/show existing ones, or delete them permanently.

---

## 🛡️ 2. How to Authorize or Change the Admin

This website uses a **UID-based authorization system** instead of a hardcoded email. This allows for maximum security and flexibility.

### To set up a new Admin:
1.  **Login**: Go to the `/admin` page and log in with the Google account you wish to use.
2.  **Get UID**: After logging in, you will see a message saying "Unauthorized" with your specific **UID** (e.g., `abc123xyz...`).
    *   *Technical Tip*: The UID is also logged to the Browser Settings > Console for easy copying.
3.  **Update Config**:
    - **Local**: Open your `.env` file and set `VITE_ADMIN_UID=your_copied_uid_here`.
    - **Production**: Add the `VITE_ADMIN_UID` environment variable to your hosting provider's dashboard (e.g., Firebase, Vercel, Netlify).
4.  **Refresh**: Refresh the page. You will now have full access to the Dashboard.

> To change the admin later, simply repeat this process with a different email and update the `VITE_ADMIN_UID` environment variable.

---

## 🎨 3. How to Change Website Colors

The website uses a centralized **CSS Variable System** to make color changes fast and consistent.

To modify the colors:
1.  Open the file: `src/index.css`.
2.  Locate the `:root` section at the top of the file:

```css
:root {
  /* Change these hex codes to update the site theme */
  --primary: #1e293b;        /* Deep Slate (Main text/Header) */
  --accent: #f59e0b;         /* Industrial Amber (Buttons/Highlights) */
  --accent-light: #fbbf24;   /* Lighter Amber (Hover states) */
  --background: #ffffff;     /* Page Background */
  --surface: #f8fafc;        /* Subtle Section Backgrounds */
}
```

3.  **Save** the file to see the changes immediately in development.
4.  **Re-build** the project (`npm run build`) before deploying the new colors to production.

---

## 📁 4. Project Data Structure

- **Database**: Projects are stored in the `projects` collection in Firestore.
- **Images**: Images are uploaded to **Cloudinary**. Ensure your `VITE_CLOUDINARY_UPLOAD_PRESET` is set to "Unsigned" in your Cloudinary dashboard to allow uploads from the admin panel.
- **Inquiries**: Customer messages are saved in the `queries` collection and emailed to you via **EmailJS**.

---

## 🚀 5. Deployment Checklist
Ensure the following variables are set in your production environment:
- `VITE_FIREBASE_*` (6 variables)
- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`
- `VITE_EMAILJS_*` (3 variables)
- `VITE_ADMIN_UID`