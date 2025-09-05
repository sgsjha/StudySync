<div align="center">

# 📚 StudySync — Your AI-Powered Study Companion

Track study sessions, organize modules, and generate personalized quizzes and mock exams with ChatGPT.

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=000000)](https://firebase.google.com)
[![OpenAI API](https://img.shields.io/badge/OpenAI%20API-integrated-000000?style=for-the-badge&logo=openai&logoColor=white)](https://platform.openai.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

</div>

---

- 🌐 Live demo: https://study-sync-ochre.vercel.app/

---

## ✨ Features

- 🔐 **User Auth:** Secure login and logout using Firebase Authentication  
- ⏱️ **Study Sessions:** Start, pause, resume, and stop study timers with automatic Firebase sync  
- 📚 **Modules & Topics:** Add, edit, and delete modules (like *Math*, *Physics*) and their topics  
- 🧠 **Quiz Generator:** Auto-generate topic-wise practice quizzes using ChatGPT  
- 📝 **Mock Exams:** Create full-length tests spanning multiple topics  
- 🤖 **ChatGPT Help:** Personalized study Q&A using GPT  
- 🖥️ **Responsive UI:** Built with Tailwind, mobile-first design  

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Shadcn/ui, Aceternity UI
- **Backend Services:**  
  - Firebase Auth  
  - Firebase Firestore   
  - OpenAI ChatGPT API (GPT-4)  
- **Tooling:** ESLint, Prettier, Vercel, `.env` config

---

## 🗂️ Project Structure

```study-sync/
├── app/
│   ├── contexts/
│   ├── SidebarDemo.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── modulesData.ts
│   ├── page.tsx
│   └── signUpForm.tsx
├── components/
│   ├── charts/
│   │   └── StudyHoursChart.tsx
│   ├── details/
│   │   ├── ModuleDetails.tsx
│   │   ├── PracticeExam.tsx
│   │   ├── PracticeExamModal.tsx
│   │   ├── TopicDetails.tsx
│   │   └── TopicQuiz.tsx
│   ├── sections/
│   │   ├── DashboardSection.tsx
│   │   ├── LeaderboardSection.tsx
│   │   ├── ModulesSection.tsx
│   │   ├── RevisionSection.tsx
│   │   └── StudySection.tsx
│   ├── ui/
│   │   ├── bento-grid.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── sheet.tsx
│   │   └── sidebar.tsx
│   └── widgets/
│       ├── Leaderboard.tsx
│       └── ModulePerformance.tsx
├── lib/
│   ├── openaiClient.ts
│   ├── practiceExamClient.ts
│   ├── streakUtils.ts
│   └── utils.ts
├── public/
│   └── logo.png
├── .gitignore
├── README.md
├── components.json
├── eslint.config.mjs
├── firebase-config.ts
├── next.config.ts
├── tsconfig.json
└── .env.local
```

---

## 🚀 Quick Start

```bash
git clone https://github.com/yourusername/study-sync.git
cd study-sync
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Scripts

| Script        | Description                     |
|---------------|---------------------------------|
| `dev`         | Start the development server    |
| `build`       | Create production build         |
| `start`       | Run the production build        |
| `lint`        | Lint the codebase               |

---

## 📬 Contact

- 🔗 [LinkedIn](https://www.linkedin.com/in/sarthak-jhaa/)
- 💻 [GitHub](https://github.com/sgsjha)
- 📸 [Instagram](https://instagram.com/sarthak.jhaa)

---

Built with 💙 for students who want smarter, stress-free studying.
