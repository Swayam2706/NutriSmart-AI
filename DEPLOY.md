# ☁️ Google Cloud Deployment Guide — NutriSmart AI

Complete step-by-step guide to deploy NutriSmart AI on **Google Cloud Run** using **Cloud Build**, **Secret Manager**, and **Container Registry**.

---

## 📋 What You'll Deploy

| Service | Platform | URL Pattern |
|---------|----------|-------------|
| Backend API (Node.js) | Cloud Run | `https://nutrismart-backend-xxxx-uc.a.run.app` |
| Frontend (React/Nginx) | Cloud Run | `https://nutrismart-frontend-xxxx-uc.a.run.app` |
| Database | MongoDB Atlas | External (free tier) |

**Total estimated cost: $0** (both services stay within Cloud Run free tier for low traffic)

---

## 🔧 Prerequisites

Install these on your machine before starting:

1. **Google Cloud SDK** → https://cloud.google.com/sdk/docs/install
2. **Docker Desktop** → https://www.docker.com/products/docker-desktop
3. **Git** → https://git-scm.com

Verify installations:
```bash
gcloud --version    # Should show: Google Cloud SDK 460+
docker --version    # Should show: Docker version 24+
git --version       # Should show: git version 2+
```

---

## PART 1 — Google Cloud Project Setup

### Step 1 — Create a Google Account & Project

1. Go to → **https://console.cloud.google.com**
2. Sign in with your Google account
3. Click **"Select a project"** (top left) → **"New Project"**
4. Fill in:
   - **Project name:** `nutrismart-ai`
   - **Project ID:** `nutrismart-ai-XXXXX` ← Google auto-generates this, note it down
   - **Location:** No organization
5. Click **"Create"**
6. Wait ~30 seconds, then select the new project from the dropdown

> ⚠️ Note your **Project ID** — you'll use it in every command below.
> Example: `nutrismart-ai-438201`

---

### Step 2 — Enable Billing

Cloud Run requires billing to be enabled (you won't be charged within free tier limits).

1. Go to → **https://console.cloud.google.com/billing**
2. Click **"Link a billing account"**
3. Add a credit/debit card (Google gives $300 free credits for new accounts)
4. Select your project and link it

---

### Step 3 — Enable Required APIs

Go to → **https://console.cloud.google.com/apis/library**

Search and enable each of these (click the API → click "Enable"):

| API Name | What it's for |
|----------|---------------|
| **Cloud Run API** | Hosting your containers |
| **Cloud Build API** | Building Docker images automatically |
| **Container Registry API** | Storing Docker images |
| **Secret Manager API** | Storing passwords/keys securely |
| **Artifact Registry API** | Alternative image registry |

**Or run this single command** (faster):
```bash
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  containerregistry.googleapis.com \
  secretmanager.googleapis.com \
  artifactregistry.googleapis.com
```

---

### Step 4 — Authenticate gcloud CLI

```bash
# Login to your Google account
gcloud auth login

# Set your project (replace with YOUR actual project ID)
gcloud config set project nutrismart-ai-438201

# Set default region
gcloud config set run/region us-central1

# Verify it's set correctly
gcloud config list
```

Expected output:
```
[core]
account = yourname@gmail.com
project = nutrismart-ai-438201

[run]
region = us-central1
```

---

## PART 2 — MongoDB Atlas Setup

### Step 5 — Create Free MongoDB Atlas Cluster

1. Go to → **https://cloud.mongodb.com**
2. Sign up / Log in
3. Click **"Build a Database"** → Choose **"M0 Free"** tier
4. Select:
   - **Cloud Provider:** AWS
   - **Region:** N. Virginia (us-east-1) ← closest to us-central1
   - **Cluster Name:** `NutriSmart`
5. Click **"Create"**

### Step 6 — Create Database User

1. In Atlas sidebar → **"Database Access"** → **"Add New Database User"**
2. Fill in:
   - **Authentication Method:** Password
   - **Username:** `nutrismart_user`
   - **Password:** Click "Autogenerate Secure Password" → **copy and save it**
   - **Database User Privileges:** "Atlas admin"
3. Click **"Add User"**

### Step 7 — Whitelist All IPs (for Cloud Run)

Cloud Run uses dynamic IPs, so we allow all:

1. In Atlas sidebar → **"Network Access"** → **"Add IP Address"**
2. Click **"Allow Access from Anywhere"** → this sets `0.0.0.0/0`
3. Click **"Confirm"**

### Step 8 — Get Your Connection String

1. In Atlas → **"Database"** → Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Driver: **Node.js**, Version: **5.5 or later**
4. Copy the connection string — it looks like:

```
mongodb+srv://nutrismart_user:<password>@nutrismart.45ffxih.mongodb.net/?retryWrites=true&w=majority&appName=NutriSmart
```

5. Replace `<password>` with the password you saved in Step 6:

```
mongodb+srv://nutrismart_user:MyActualPassword123@nutrismart.45ffxih.mongodb.net/nutrismart?retryWrites=true&w=majority&appName=NutriSmart
```

> Save this full string — you'll need it in the next step.

---

## PART 3 — Store Secrets in Secret Manager

Never put passwords in code or environment files. We use **Google Secret Manager**.

### Step 9 — Create All Secrets

Run these commands one by one in your terminal.

**Replace the values in quotes with YOUR actual values:**

```bash
# 1. MongoDB connection string (from Step 8)
echo -n "mongodb+srv://nutrismart_user:MyActualPassword123@nutrismart.45ffxih.mongodb.net/nutrismart?retryWrites=true&w=majority&appName=NutriSmart" \
  | gcloud secrets create MONGODB_URI --data-file=-

# 2. JWT Secret — generate a strong random key
echo -n "NutriSmartJWT_SuperSecret_Key_2025_DoNotShare_Min32Chars!" \
  | gcloud secrets create JWT_SECRET --data-file=-

# 3. Frontend URL — fill this AFTER deploying frontend (use placeholder for now)
echo -n "https://nutrismart-frontend-placeholder-uc.a.run.app" \
  | gcloud secrets create FRONTEND_URL --data-file=-

# 4. Backend URL — fill this AFTER deploying backend (use placeholder for now)
echo -n "https://nutrismart-backend-placeholder-uc.a.run.app" \
  | gcloud secrets create BACKEND_URL --data-file=-

# 5. Seed key — protects the /api/foods/seed endpoint in production
echo -n "seed-nutrismart-2025-secret" \
  | gcloud secrets create SEED_KEY --data-file=-
```

Verify all secrets were created:
```bash
gcloud secrets list
```

Expected output:
```
NAME           CREATED              REPLICATION_POLICY  LOCATIONS
BACKEND_URL    2025-01-01T00:00:00  automatic           -
FRONTEND_URL   2025-01-01T00:00:00  automatic           -
JWT_SECRET     2025-01-01T00:00:00  automatic           -
MONGODB_URI    2025-01-01T00:00:00  automatic           -
SEED_KEY       2025-01-01T00:00:00  automatic           -
```

---

## PART 4 — Grant Cloud Build Permissions

### Step 10 — Get Your Project Number

```bash
gcloud projects describe nutrismart-ai-438201 --format="value(projectNumber)"
```

This outputs a number like: `123456789012`

Save this number — replace `PROJECT_NUMBER` in the commands below.

### Step 11 — Grant Secret Access to Cloud Build

```bash
# Replace 123456789012 with YOUR project number from Step 10

# Grant access to each secret
gcloud secrets add-iam-policy-binding MONGODB_URI \
  --member="serviceAccount:123456789012@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding JWT_SECRET \
  --member="serviceAccount:123456789012@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding FRONTEND_URL \
  --member="serviceAccount:123456789012@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding BACKEND_URL \
  --member="serviceAccount:123456789012@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding SEED_KEY \
  --member="serviceAccount:123456789012@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Step 12 — Grant Cloud Build permission to deploy to Cloud Run

```bash
# Replace 123456789012 with YOUR project number

gcloud projects add-iam-policy-binding nutrismart-ai-438201 \
  --member="serviceAccount:123456789012@cloudbuild.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding nutrismart-ai-438201 \
  --member="serviceAccount:123456789012@cloudbuild.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
```

---

## PART 5 — Deploy the Application

### Step 13 — Clone the Repository

```bash
git clone https://github.com/Swayam2706/NutriSmart-AI.git
cd NutriSmart-AI
```

### Step 14 — Deploy Backend First

We deploy backend manually first to get its URL, then update the secret.

```bash
# Build and push backend Docker image
gcloud builds submit ./backend \
  --tag gcr.io/nutrismart-ai-438201/nutrismart-backend:v1

# Deploy backend to Cloud Run
gcloud run deploy nutrismart-backend \
  --image gcr.io/nutrismart-ai-438201/nutrismart-backend:v1 \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 5000 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 3 \
  --set-env-vars NODE_ENV=production \
  --set-secrets MONGODB_URI=MONGODB_URI:latest,JWT_SECRET=JWT_SECRET:latest,FRONTEND_URL=FRONTEND_URL:latest,SEED_KEY=SEED_KEY:latest
```

After deployment, you'll see output like:
```
Service [nutrismart-backend] revision [nutrismart-backend-00001-abc] has been deployed
Service URL: https://nutrismart-backend-abcd1234-uc.a.run.app
```

**Copy that URL** — e.g. `https://nutrismart-backend-abcd1234-uc.a.run.app`

### Step 15 — Update BACKEND_URL Secret

```bash
# Replace with YOUR actual backend URL from Step 14
echo -n "https://nutrismart-backend-abcd1234-uc.a.run.app" \
  | gcloud secrets versions add BACKEND_URL --data-file=-
```

### Step 16 — Deploy Frontend

```bash
# Build frontend Docker image with the backend URL baked in
gcloud builds submit ./frontend \
  --tag gcr.io/nutrismart-ai-438201/nutrismart-frontend:v1 \
  --substitutions _VITE_API_URL="https://nutrismart-backend-abcd1234-uc.a.run.app/api"

# Deploy frontend to Cloud Run
gcloud run deploy nutrismart-frontend \
  --image gcr.io/nutrismart-ai-438201/nutrismart-frontend:v1 \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 80 \
  --memory 256Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 3
```

After deployment, you'll see:
```
Service URL: https://nutrismart-frontend-abcd1234-uc.a.run.app
```

**Copy that URL** — e.g. `https://nutrismart-frontend-abcd1234-uc.a.run.app`

### Step 17 — Update FRONTEND_URL Secret

```bash
# Replace with YOUR actual frontend URL from Step 16
echo -n "https://nutrismart-frontend-abcd1234-uc.a.run.app" \
  | gcloud secrets versions add FRONTEND_URL --data-file=-
```

### Step 18 — Redeploy Backend with Correct FRONTEND_URL

The backend needs the real frontend URL for CORS. Redeploy it:

```bash
gcloud run deploy nutrismart-backend \
  --image gcr.io/nutrismart-ai-438201/nutrismart-backend:v1 \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 5000 \
  --set-env-vars NODE_ENV=production \
  --set-secrets MONGODB_URI=MONGODB_URI:latest,JWT_SECRET=JWT_SECRET:latest,FRONTEND_URL=FRONTEND_URL:latest,SEED_KEY=SEED_KEY:latest
```

---

## PART 6 — Seed the Food Database

### Step 19 — Seed Food Data

```bash
# Replace with YOUR actual backend URL
curl -X POST https://nutrismart-backend-abcd1234-uc.a.run.app/api/foods/seed
```

Expected response:
```json
{ "message": "Seeded 50 foods successfully" }
```

---

## PART 7 — Verify Everything Works

### Step 20 — Test the Backend Health Check

```bash
curl https://nutrismart-backend-abcd1234-uc.a.run.app/health
```

Expected:
```json
{ "status": "ok", "timestamp": "2025-01-01T00:00:00.000Z" }
```

### Step 21 — Open the App

Visit your frontend URL in a browser:
```
https://nutrismart-frontend-abcd1234-uc.a.run.app
```

1. Click **"Get Started Free"**
2. Register with your name, email, password, age, weight, height, diet, goal
3. You should land on the Dashboard
4. Go to **Smart Fuel** — you should see food recommendations
5. Go to **Tracker** → Add a meal
6. Go to **Habits** → Complete a habit

---

## PART 8 — Set Up Auto-Deploy (CI/CD)

### Step 22 — Connect GitHub to Cloud Build

1. Go to → **https://console.cloud.google.com/cloud-build/triggers**
2. Click **"Connect Repository"**
3. Select **"GitHub (Cloud Build GitHub App)"**
4. Click **"Install Google Cloud Build"** on GitHub
5. Authorize and select the `NutriSmart-AI` repository
6. Click **"Connect"**

### Step 23 — Create Build Trigger

1. Click **"Create Trigger"**
2. Fill in:
   - **Name:** `deploy-on-push`
   - **Event:** Push to a branch
   - **Branch:** `^main$`
   - **Configuration:** Cloud Build configuration file
   - **Location:** Repository
   - **Cloud Build configuration file location:** `cloudbuild.yaml`
3. Click **"Create"**

Now every `git push` to `main` will automatically rebuild and redeploy both services.

---

## PART 9 — View Logs & Monitor

### Cloud Run Logs

```bash
# Backend logs
gcloud run services logs read nutrismart-backend --region us-central1 --limit 50

# Frontend logs
gcloud run services logs read nutrismart-frontend --region us-central1 --limit 50
```

Or in the Console:
- Go to → **https://console.cloud.google.com/run**
- Click on `nutrismart-backend` → **"Logs"** tab

### Cloud Build History

- Go to → **https://console.cloud.google.com/cloud-build/builds**
- See all build history, logs, and status

---

## 🔄 Update the App After Code Changes

```bash
# Make your code changes, then:
git add .
git commit -m "feat: your change description"
git push origin main
# Cloud Build automatically picks this up and redeploys
```

Or manually trigger:
```bash
gcloud builds submit --config cloudbuild.yaml .
```

---

## 💰 Cost Estimate

| Resource | Free Tier | Typical Usage |
|----------|-----------|---------------|
| Cloud Run (backend) | 2M requests/month free | ~$0 |
| Cloud Run (frontend) | 2M requests/month free | ~$0 |
| Cloud Build | 120 min/day free | ~$0 |
| Container Registry | 0.5 GB free | ~$0 |
| Secret Manager | 6 active secrets free | ~$0 |
| MongoDB Atlas M0 | Always free | $0 |
| **Total** | | **~$0/month** |

---

## 🛠️ Troubleshooting

### "Permission denied" on gcloud commands
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### Backend returns 500 errors
```bash
# Check logs for the real error
gcloud run services logs read nutrismart-backend --region us-central1 --limit 20
```

### CORS errors in browser
- Make sure `FRONTEND_URL` secret has the exact frontend URL (no trailing slash)
- Redeploy backend after updating the secret (Step 18)

### "MongoDB connection error"
- Check Atlas Network Access has `0.0.0.0/0` whitelisted
- Verify the `MONGODB_URI` secret has the correct password
- Test the connection string locally first

### Frontend shows blank page
- Check browser console for errors
- Verify `VITE_API_URL` was set correctly during the Docker build (Step 16)
- Make sure the backend URL doesn't have a trailing slash

### Cloud Build fails
```bash
# View detailed build logs
gcloud builds list --limit 5
gcloud builds log BUILD_ID
```

---

## 📌 Quick Reference — Your URLs

Fill these in as you complete the steps:

| Item | Value |
|------|-------|
| GCP Project ID | `nutrismart-ai-XXXXX` |
| GCP Project Number | `XXXXXXXXXXXX` |
| Backend URL | `https://nutrismart-backend-XXXX-uc.a.run.app` |
| Frontend URL | `https://nutrismart-frontend-XXXX-uc.a.run.app` |
| MongoDB URI | `mongodb+srv://nutrismart_user:PASSWORD@...` |

---

## 📌 All Commands in Order (Copy-Paste Cheatsheet)

```bash
# ── Setup ──────────────────────────────────────────────────────────────────────
gcloud auth login
gcloud config set project nutrismart-ai-438201
gcloud config set run/region us-central1
gcloud services enable run.googleapis.com cloudbuild.googleapis.com containerregistry.googleapis.com secretmanager.googleapis.com

# ── Secrets ────────────────────────────────────────────────────────────────────
echo -n "YOUR_MONGODB_URI"   | gcloud secrets create MONGODB_URI   --data-file=-
echo -n "YOUR_JWT_SECRET"    | gcloud secrets create JWT_SECRET    --data-file=-
echo -n "placeholder"        | gcloud secrets create FRONTEND_URL  --data-file=-
echo -n "placeholder"        | gcloud secrets create BACKEND_URL   --data-file=-
echo -n "YOUR_SEED_KEY"      | gcloud secrets create SEED_KEY      --data-file=-

# ── Permissions ────────────────────────────────────────────────────────────────
PROJECT_NUMBER=$(gcloud projects describe nutrismart-ai-438201 --format="value(projectNumber)")
for SECRET in MONGODB_URI JWT_SECRET FRONTEND_URL BACKEND_URL SEED_KEY; do
  gcloud secrets add-iam-policy-binding $SECRET \
    --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
done
gcloud projects add-iam-policy-binding nutrismart-ai-438201 \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/run.admin"
gcloud projects add-iam-policy-binding nutrismart-ai-438201 \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# ── Deploy Backend ─────────────────────────────────────────────────────────────
gcloud builds submit ./backend --tag gcr.io/nutrismart-ai-438201/nutrismart-backend:v1
gcloud run deploy nutrismart-backend \
  --image gcr.io/nutrismart-ai-438201/nutrismart-backend:v1 \
  --region us-central1 --platform managed --allow-unauthenticated \
  --port 5000 --memory 512Mi \
  --set-env-vars NODE_ENV=production \
  --set-secrets MONGODB_URI=MONGODB_URI:latest,JWT_SECRET=JWT_SECRET:latest,FRONTEND_URL=FRONTEND_URL:latest,SEED_KEY=SEED_KEY:latest

# ── Update BACKEND_URL secret with real URL ────────────────────────────────────
echo -n "https://nutrismart-backend-XXXX-uc.a.run.app" | gcloud secrets versions add BACKEND_URL --data-file=-

# ── Deploy Frontend ────────────────────────────────────────────────────────────
gcloud builds submit ./frontend \
  --tag gcr.io/nutrismart-ai-438201/nutrismart-frontend:v1 \
  --substitutions _VITE_API_URL="https://nutrismart-backend-XXXX-uc.a.run.app/api"
gcloud run deploy nutrismart-frontend \
  --image gcr.io/nutrismart-ai-438201/nutrismart-frontend:v1 \
  --region us-central1 --platform managed --allow-unauthenticated \
  --port 80 --memory 256Mi

# ── Update FRONTEND_URL secret with real URL ───────────────────────────────────
echo -n "https://nutrismart-frontend-XXXX-uc.a.run.app" | gcloud secrets versions add FRONTEND_URL --data-file=-

# ── Redeploy backend with correct FRONTEND_URL ────────────────────────────────
gcloud run deploy nutrismart-backend \
  --image gcr.io/nutrismart-ai-438201/nutrismart-backend:v1 \
  --region us-central1 --platform managed --allow-unauthenticated \
  --port 5000 --set-env-vars NODE_ENV=production \
  --set-secrets MONGODB_URI=MONGODB_URI:latest,JWT_SECRET=JWT_SECRET:latest,FRONTEND_URL=FRONTEND_URL:latest,SEED_KEY=SEED_KEY:latest

# ── Seed food data ─────────────────────────────────────────────────────────────
curl -X POST https://nutrismart-backend-XXXX-uc.a.run.app/api/foods/seed
```
