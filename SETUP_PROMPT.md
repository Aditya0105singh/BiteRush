# BiteRush — Claude Code Setup Prompt

Paste the block below into a new Claude Code session to auto-setup the project.

---

## PROMPT (copy everything below this line)

```
Set up the BiteRush online food delivery project located at:
d:\1 placement\project\BiteRush\online-food-delivery-project\online-food-delivery-project

The project has 3 parts:
- foodiesapi/     → Spring Boot 3.4.3 + Java 21 + MongoDB + AWS S3 + JWT + Razorpay (port 8080)
- adminpanel/     → React 19 + Vite (port 5173)
- foodies/        → React 18 + Vite (port 5174)

Do the following steps in order:

STEP 1 — Install frontend dependencies
Run `npm install` inside both `adminpanel/` and `foodies/` if node_modules is missing.

STEP 2 — Check MongoDB
Run `mongod --version` to see if MongoDB is installed.
- If installed: check if the service is running with `Get-Service MongoDB` (PowerShell).
  If not running, start it with `Start-Service MongoDB`.
- If NOT installed: tell me to install MongoDB Community Edition to D:\MongoDB
  (C: drive has 0KB free). Give me the exact download link and installer steps.
  After I confirm it's installed, continue.

STEP 3 — Configure backend environment
Read foodiesapi/.env and check which values are still placeholders.
For each placeholder, ask me to provide the real value.
The required variables are:
  AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION, AWS_BUCKET_NAME
  JWT_SECRET (generate a random 64-char string automatically — I don't need to provide this)
  RAZORPAY_KEY, RAZORPAY_SECRET

Once I give you the values, write them into foodiesapi/.env

STEP 4 — Configure Razorpay in the frontend
Edit foodies/src/util/contants.js and replace "razor_pay_key" with the RAZORPAY_KEY I provided.

STEP 5 — Build and run the Spring Boot backend
From inside foodiesapi/, set all env vars from .env and run:
  .\mvnw spring-boot:run
Or if the jar already exists at target/foodiesapi-0.0.1-SNAPSHOT.jar, run it with:
  java -jar target\foodiesapi-0.0.1-SNAPSHOT.jar
Wait for "Started FoodiesapiApplication" in the output before continuing.

STEP 6 — Start the frontends
Open two cmd windows:
  Window 1: cd adminpanel && npm run dev   → http://localhost:5173
  Window 2: cd foodies  && npm run dev     → http://localhost:5174

STEP 7 — Smoke test
- Hit http://localhost:8080 and confirm the API is responding
- Hit http://localhost:5173 and confirm the admin panel loads
- Hit http://localhost:5174 and confirm the storefront loads
- Report any errors

Tell me clearly at the end what is working and what still needs attention.
```
