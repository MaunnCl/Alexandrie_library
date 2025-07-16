# Alexandria Frontend - User Guide

This document explains how end users can interact with the Alexandria web application. The guide assumes that the frontend has been deployed alongside the backend API and that a modern browser is available.

## 1. Getting Started

1. **Navigate to the Home Page**
   - Open your browser and enter the URL of the Alexandria application after running the project via `npm run dev` (for example `http://localhost:5173/`).
   - You will land on the home page which introduces the platform and allows you to explore public content.

2. **Create an Account**
   - Click the **Register** link in the navigation bar.
   - The registration process consists of multiple steps:
     1. **Basic Information** – provide your email address, create a password and confirm it.
     2. **Profile Details** – fill out your name, organization and optional address information.
     3. **Confirmation** – verify the information and submit the form.
   - After successful registration you will automatically be logged in.

3. **Sign In**
   - If you already have an account choose **Login** from the navigation bar.
   - Enter your email and password then click **Sign In**. A JWT token is stored in `localStorage` and used for subsequent API calls.

4. **Browse Videos**
   - The **Categories** page lists all video categories available on the platform. Selecting a category displays a grid of videos.
   - You can also use the search bar in the header to search for a title or speaker.
   - Clicking a video thumbnail takes you to the **Watch** page where the video starts playing.

5. **Congress & Speakers**
   - The **Congress** directory page shows upcoming and past congress events. Selecting one displays a detail modal with schedule and speaker list.
   - Speaker profiles can be reached via the **Speaker** page or by clicking on a speaker’s name when viewing a congress event.

6. **Manage Your Profile**
   - Use the **Profile** page to update your personal data. Changes are saved automatically when you leave an input field.
   - From this page you can also manage your subscription plan and view your payment history.

7. **Subscription Plans and Checkout**
   - Open the **Plans** page to see available subscription tiers.
   - Clicking **Subscribe** brings you to the **Checkout** page where you can enter payment details. Successful payments update your subscription and unlock premium content.

8. **Log Out**
   - Click the **Logout** link in the navigation to remove the stored JWT token and return to the login page.

## 2. Troubleshooting

- **Forgot Password** – If you can’t sign in, contact the platform administrator to reset your password. The demo app does not implement email password reset.
- **Video Playback Issues** – Ensure your browser supports HTML5 video and that network access to the video CDN is not blocked.
- **API Errors** – If API calls fail with “401 Unauthorized,” you may have an expired session. Log in again to refresh your token.

## 3. Accessibility

The interface aims to be keyboard accessible and includes ARIA labels on interactive elements. If you encounter any issue related to accessibility, please report it to the development team.

## 4. Keyboard Shortcuts

- `Ctrl + /` focuses the search bar.
- `Space` toggles play/pause on the video player when it is in focus.
