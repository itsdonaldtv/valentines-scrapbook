# Valentine's Scrapbook - Setup Guide

## Features

✨ **Mobile-Optimized** - Beautiful on phones, tablets, and desktops
🔐 **Secure Login** - Username/password authentication
📸 **Monthly Photos** - One photo per month stored in GitHub
🎵 **YouTube Songs** - Link your favorite Valentine's song (not stored)
👁️ **Guest View** - Share read-only links with your Valentine
💾 **Auto-Save** - All changes persist to GitHub

## Prerequisites

- Node.js 22+ (or 20.19+)
- npm or yarn
- Cloudinary account (free)

## Setup Instructions

### 1. Create Cloudinary Account

1. Go to https://cloudinary.com/users/register/free
2. Sign up (free tier gives you 25GB storage)
3. Go to your Dashboard
4. Copy your **Cloud Name** (displayed at the top)

### 2. Create Upload Preset (for unsigned uploads)

1. In Cloudinary Dashboard, go to **Settings** → **Upload**
2. Scroll to "Upload presets"
3. Click "Add upload preset"
4. Name: `valentines_scrapbook`
5. Set "Signing Mode" to **Unsigned**
6. Click "Save"

### 3. Configure Environment Variables

1. Open `valentines-scrapbook/.env`
2. Add your Cloudinary cloud name:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
```

### 4. Install Dependencies

```bash
cd valentines-scrapbook
npm install
```

### 5. Run Locally

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

**Default credentials:**
- Username: `valentine`
- Password: `ValentinesDay2025!`

Change these on first login!

## Usage

### As the Owner (You)

1. **Login** with your username and password
2. **Create a Year** - Click "✨ Add New Year" and enter the year (e.g., 2025)
3. **Add Photos** - Click the "📷 Add" button on each month to upload a photo
4. **Add Song** - Click "🎵 Add Your Song" and paste a YouTube URL
5. **Share** - Copy the guest link and send it to your Valentine

### As a Guest (Your Valentine)

1. **Open the guest link** you received
2. **View photos** for each month
3. **Listen to the song** (read-only, can't edit)
4. **No login required** - just view and enjoy!

## Changing Your Password

The app stores credentials in browser localStorage. To change your password:

1. Open browser DevTools (F12)
2. Go to Console
3. Run:
```javascript
localStorage.setItem('authConfig', JSON.stringify({
  username: 'valentine',
  passwordHash: 'your_new_hash'
}));
```

Or simply clear localStorage and re-login with new credentials.

## Deploying to GitHub Pages

### 1. Build the App

```bash
npm run build
```

### 2. Deploy to GitHub Pages

Option A: Using GitHub CLI
```bash
gh repo deploy --dir dist
```

Option B: Manual
1. Push the `dist` folder to your repository
2. Go to repository Settings → Pages
3. Set source to `main` branch, `/dist` folder
4. Your site will be live at `https://username.github.io/valentines-scrapbook`

### 3. Share the Links

**For you (editor):**
```
https://username.github.io/valentines-scrapbook
```

**For your Valentine (guest):**
```
https://username.github.io/valentines-scrapbook?guest=true
```

## Troubleshooting

### Photos not uploading?
- Check your Cloudinary cloud name is correct in `.env`
- Verify the upload preset `valentines_scrapbook` exists and is set to **Unsigned**
- Check browser console for error messages

### Can't login?
- Default username: `valentine`
- Default password: `2025`
- Check localStorage isn't cleared

### Guest link not working?
- Make sure you're using the full URL with `?guest=true`
- Guest view is read-only (no editing)

### Images not loading?
- Check the Cloudinary dashboard to verify images were uploaded
- Verify your cloud name is correct in `.env`
- Check browser console for error messages

## File Structure

Images are stored in Cloudinary with this structure:
```
valentines-scrapbook/
├── 2025/
│   ├── jan
│   ├── feb
│   └── ... (one per month)
├── 2026/
│   └── ...
```

## Security Notes

✅ **No secrets exposed** - Cloudinary cloud name is public
✅ **No GitHub token needed** - No credentials in browser
✅ **Unsigned uploads** - Upload preset handles authentication
✅ **Free tier** - 25GB storage included
✅ **Fast delivery** - CDN-backed image serving

## Support

For issues or questions, check:
- Browser console for error messages
- GitHub API rate limits (60 requests/hour unauthenticated)
- File size limits (GitHub has 100MB file size limit)

Enjoy your Valentine's Scrapbook! 💕
