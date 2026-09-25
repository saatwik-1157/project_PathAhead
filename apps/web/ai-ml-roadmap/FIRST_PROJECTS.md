# First AI/ML Projects — Start This Week

Ordered easiest → hardest. Do them **in order** — each builds skills for the next. Put every one on GitHub with a clear README.

> You can start **Project 1 in Week 5** of the study plan (right after you learn regression). Don't wait until you "know everything" — you never will.

---

## Project 1 — House Price Predictor (regression) ⭐ start here
**Skills:** pandas, data cleaning, linear regression, evaluation
**Time:** ~1 week

**Steps:**
1. Download a dataset — Kaggle "House Prices" or the built-in `sklearn` California Housing.
2. Load with pandas, explore: `.head()`, `.describe()`, `.isnull().sum()`.
3. Clean: handle missing values, encode any categorical columns.
4. Plot: price vs a few features (scatter/box plots).
5. Split into train/test (`train_test_split`).
6. Train `LinearRegression`, then also try `RandomForestRegressor`.
7. Evaluate with RMSE and R². Compare the two models.
8. Write a README: problem, approach, results, what you'd improve.

**Stretch:** add feature engineering (e.g., price per room) and see if it helps.

---

## Project 2 — Classifier (spam / sentiment / survival) 
**Skills:** classification, metrics, feature encoding
**Time:** ~1 week

**Options (pick one):**
- Titanic survival prediction (classic beginner Kaggle)
- SMS spam detection
- Movie review sentiment (positive/negative)

**Steps:**
1. Load and explore the data.
2. Prepare features (for text: `CountVectorizer` or `TfidfVectorizer`).
3. Train `LogisticRegression`, then `RandomForestClassifier`.
4. Evaluate: accuracy, precision, recall, F1, confusion matrix.
5. Explain which model won and *why*.

**Stretch:** tune hyperparameters with `GridSearchCV`.

---

## Project 3 — Image Classifier (CNN, deep learning)
**Skills:** PyTorch, CNNs, transfer learning
**Time:** ~2 weeks (start after Week 15)

**Steps:**
1. Start with MNIST digits (built into PyTorch) to learn the training loop.
2. Then do a real dataset: cats vs dogs, or pick your own (e.g., flower types).
3. Build a small CNN, train it, track accuracy per epoch.
4. Use **transfer learning** (pretrained ResNet) — compare accuracy vs your scratch CNN.
5. Show a few predictions with images in your notebook.

**Stretch:** deploy a demo on Hugging Face Spaces where users upload an image.

---

## Project 4 — LLM App: Document Q&A (RAG) 🔥 the in-demand one
**Skills:** LLM APIs, embeddings, vector search, app building
**Time:** ~2 weeks (start after Week 22)

**What it does:** User uploads a PDF/notes → asks questions → app answers using the document.

**Steps:**
1. Get an API key (Claude or OpenAI).
2. Split a document into chunks.
3. Create embeddings, store them in a vector DB (FAISS or Chroma).
4. On a question: retrieve the most relevant chunks, feed them + the question to the LLM.
5. Wrap it in a **Streamlit** UI (upload box + chat).
6. Deploy on Streamlit Cloud or Hugging Face Spaces.

**Why it matters:** RAG is one of the most requested skills in AI jobs right now.

---

## Project 5 — Capstone: End-to-End Deployed ML App
**Skills:** everything + engineering
**Time:** ~2 weeks

Take any earlier project and make it **production-shaped**:
1. Clean, modular code (not just a notebook).
2. Serve the model via a **FastAPI** endpoint.
3. Simple frontend (Streamlit or a small web page).
4. Containerize with Docker.
5. Deploy live (Render / Railway / HF Spaces).
6. README with architecture diagram + live demo link.

This is the project you talk about in interviews.

---

## Rules for every project
- ✅ Public GitHub repo, one project each
- ✅ README: problem → approach → results → screenshots → how to run
- ✅ Commit often with clear messages
- ✅ Write 3–4 sentences on what you learned and what you'd do differently
- ❌ Don't copy-paste blindly — type it, break it, understand it

---

## Where to get datasets
- **Kaggle** (kaggle.com/datasets) — huge, free, with community notebooks
- **scikit-learn** built-in datasets (great for practice)
- **Hugging Face Datasets** (for NLP)
- **UCI ML Repository**

---

## This week's concrete first step
1. Install Python + set up VS Code (or use Google Colab — zero setup, free).
2. Create a GitHub account if you don't have one.
3. Start **Project 1**: download the California Housing dataset and just get it loaded and plotted.

That's it. Ship the first small thing, then keep going.
