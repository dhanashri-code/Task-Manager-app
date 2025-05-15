
const botSteps = {
  start: {
    message: "👋 Hello! I'm your personal Task Manager Assistant. I'm here to help you explore and understand the key features of our task management platform. What would you like to do?",
    options: [
      { label: "🧭 Explain Step-by-Step", next: "step1" },
      { label: "📋 List Features", next: "listFeatures" },
      { label: "❌ End Chat", next: "end" }
    ]
  },

  // --- Step-by-Step Flow ---
  step1: {
    message: "📝 Step 1: First, you need to register a new account or log in if you're an existing user. This ensures all your tasks are securely saved and accessible anytime.",
    options: [{ label: "➡️ Next", next: "step2" }]
  },
  step2: {
    message: "📌 Step 2: Once logged in, you can begin creating tasks. You can assign deadlines to keep things organized and timely.",
    options: [{ label: "➡️ Next", next: "step3" }]
  },
  step3: {
    message: "🎙️ Step 3: Tasks can be added either manually through the interface or more conveniently using voice commands, which makes the process much faster and hands-free.",
    options: [{ label: "➡️ Next", next: "step4" }]
  },
  step4: {
    message: "🔍 Step 4: You can search for tasks or apply filters based on their completion status—either complete or incomplete—making it easy to manage priorities.",
    options: [{ label: "➡️ Next", next: "step5" }]
  },
  step5: {
    message: "📊 Step 5: Visit the dashboard to get a visual overview of your task performance, completion stats, and deadlines. This helps in tracking productivity effectively.",
    options: [{ label: "➡️ Next", next: "step6" }]
  },
  step6: {
    message: "🔔 Step 6: Stay updated with real-time notifications for task completions, additions, and upcoming deadlines, ensuring you never miss important updates.",
    options: [{ label: "➡️ Next", next: "step7" }]
  },
  step7: {
    message: "🔒 Step 7: You can securely log out of your account or delete it anytime if you choose to stop using the service.",
    options: [{ label: "➡️ Next", next: "step8" }]
  },
  step8: {
    message: "⏱️ Step 8: For security, your session token is valid for 1 hour. After that, you'll need to log in again to continue using the platform.",
    options: [{ label: "❌ End Chat", next: "end" }]
  },

  // --- Feature List View ---
  listFeatures: {
    message:
    "📋 Here's a comprehensive list of the features you can explore in this Task Manager: " +
    "1️⃣ Secure user registration and login. " +
    "2️⃣ Create, read, update, and delete tasks. " +
    "3️⃣ Add tasks using voice input. " +
    "4️⃣ Search and filter tasks easily. " +
    "5️⃣ Dashboard to monitor task statistics. " +
    "6️⃣ Notifications for important updates. " +
    "7️⃣ Log out or delete your account anytime. " +
    "8️⃣ Session token expiry for enhanced security. ",
    
    options: [
      { label: "1", next: "feature1" },
      { label: "2", next: "feature2" },
      { label: "3", next: "feature3" },
      { label: "4", next: "feature4" },
      { label: "5", next: "feature5" },
      { label: "6", next: "feature6" },
      { label: "7", next: "feature7" },
      { label: "8", next: "feature8" },
      { label: "❌ End Chat", next: "end" }
    ]
  },

  feature1: {
    message: "🔐 Feature 1: Register and log in securely to access your personalized task manager and ensure your data is saved safely.",
    options: [{ label: "❌ End Chat", next: "end" }]
  },
  feature2: {
    message: "🛠️ Feature 2: Perform full task operations—create new tasks, update them, delete old ones, and manage everything in one place.",
    options: [{ label: "❌ End Chat", next: "end" }]
  },
  feature3: {
    message: "🎤 Feature 3: Quickly add tasks by speaking—perfect for when you're on the go and need a hands-free experience.",
    options: [{ label: "❌ End Chat", next: "end" }]
  },
  feature4: {
    message: "🔍 Feature 4: Locate your tasks in seconds by searching keywords or filtering based on whether they are completed or pending.",
    options: [{ label: "❌ End Chat", next: "end" }]
  },
  feature5: {
    message: "📊 Feature 5: Use your dashboard to get a visual summary of tasks and performance metrics that help you stay on top of everything.",
    options: [{ label: "❌ End Chat", next: "end" }]
  },
  feature6: {
    message: "🔔 Feature 6: Receive instant notifications when tasks are due, completed, or added—keeping you constantly informed.",
    options: [{ label: "❌ End Chat", next: "end" }]
  },
  feature7: {
    message: "🔓 Feature 7: You always have the freedom to log out securely or delete your account permanently with a single action.",
    options: [{ label: "❌ End Chat", next: "end" }]
  },
  feature8: {
    message: "⏰ Feature 8: For your security, login sessions expire after one hour. Simply log back in to keep working seamlessly.",
    options: [{ label: "❌ End Chat", next: "end" }]
  },

  end: {
    message: "👋 Thanks for chatting with the Task Manager Bot! If you ever need help again, just restart the conversation.",
    options: [
      { label: "🔁 Restart", next: "start" }
    ]
  }
};


exports.chatbotResponse = (req, res) => {
  const { step } = req.body;
  const response = botSteps[step] || botSteps.start;
  res.status(200).json({ reply: response.message, options: response.options });
};