Real-Time Product Management Dashboard — Frontend



This is the Next.js (TypeScript) frontend for the Real-Time Product Management Dashboard.

It connects to Firebase for authentication and product storage, and talks to the backend API for analytics and admin tasks.



1\. Prerequisites



You’ll need:



Node.js 18+



npm or yarn



Firebase project credentials (see below)



2\. Setup

1\. Clone the repo

git clone https://github.com/fozayelibnayaz/real-time-product-management-dashboard-frontend.git

cd real-time-product-management-dashboard-frontend



2\. Install dependencies

npm install



3\. Create an .env.local file



At the root of this folder, create a file named .env.local and add your Firebase web config values:



NEXT\_PUBLIC\_FIREBASE\_API\_KEY=your\_api\_key

NEXT\_PUBLIC\_FIREBASE\_AUTH\_DOMAIN=your\_project.firebaseapp.com

NEXT\_PUBLIC\_FIREBASE\_PROJECT\_ID=your\_project\_id

NEXT\_PUBLIC\_FIREBASE\_STORAGE\_BUCKET=your\_project.appspot.com

NEXT\_PUBLIC\_FIREBASE\_MESSAGING\_SENDER\_ID=your\_sender\_id

NEXT\_PUBLIC\_FIREBASE\_APP\_ID=your\_app\_id



NEXT\_PUBLIC\_API\_URL=http://localhost:4000/api





🔹 Make sure these values match the same Firebase project your backend service account uses.



4\. Run locally

npm run dev





Then open http://localhost:3000



5\. Deploying



You can deploy to Vercel, Netlify, or any platform that supports Next.js.



If deploying to Vercel:



Go to your project in Vercel.



Add all the .env.local values as Environment Variables in the Vercel dashboard.



Deploy from your main branch.



6\. Folder overview

Folder	Description

/components	Reusable UI components

/pages	Next.js routes

/lib	Firebase client setup and utilities

/styles	Global and module CSS

7\. Common issues



Blank analytics or no data → Check backend API URL and make sure both frontend and backend use the same Firebase project ID.



Auth not working → Verify Firebase Authentication is enabled in your Firebase Console (Email/Password sign-in).



8\. Commands

Command	Description

npm run dev	Run local development server

npm run build	Build for production

npm start	Run production build locally

npm run lint	Run ESLint

9\. Contact



If something’s unclear or you need to onboard another developer, open an issue in this repo or contact the maintainer directly.

