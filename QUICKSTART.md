# Quick Start (5 minutes)

## Step 1: Get Cloudinary Cloud Name (2 min)

1. Go to https://cloudinary.com/users/register/free
2. Sign up and go to Dashboard
3. Copy your **Cloud Name**

## Step 2: Create Upload Preset (1 min)

1. Go to **Settings** → **Upload**
2. Click "Add upload preset"
3. Name: `valentines_scrapbook`
4. Set "Signing Mode" to **Unsigned**
5. Save

## Step 3: Configure App (1 min)

Edit `.env`:
```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
```

## Step 4: Run Locally (1 min)

```bash
npm install
npm run dev
```

Open http://localhost:5173

**Login:**
- Username: `valentine`
- Password: `ValentinesDay2025!`

## Step 5: Test It

1. Create year: "2025"
2. Add a photo to January (uploads to Cloudinary)
3. Add a YouTube song
4. Copy guest link from browser URL bar + `?guest=true`

## Step 6: Deploy (Optional)

```bash
npm run build
# Push dist/ to GitHub Pages
```

## Share Links

**You (editor):**
```
https://yourusername.github.io/valentines-scrapbook
```

**Your Valentine (guest):**
```
https://yourusername.github.io/valentines-scrapbook?guest=true
```

Done! 💕

---

For detailed setup, see `SETUP.md`
