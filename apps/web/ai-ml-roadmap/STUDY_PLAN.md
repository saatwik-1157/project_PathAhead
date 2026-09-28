# AI/ML Engineer — From Scratch (Dated Plan)

A 24-week (6-month) plan at ~10–12 hrs/week. **Start: Mon 14 Jul 2026 · Finish: Sun 28 Dec 2026.**
Adjust pace to your life — the **order** matters more than the exact dates. Tick boxes as you go.

> Golden rule: **Learn a concept → immediately code it → build something small with it.** Watching without coding is wasted time.

---

## Phase 0 — Foundations (14 Jul – 10 Aug)

**Goal:** Comfortable with Python + just-enough math.

### Week 1 · 14–20 Jul — Python basics
- [ ] Variables, data types, if/else, loops, functions
- [ ] Lists, dicts, sets, tuples; list/dict comprehensions
- [ ] Read/write files, handle errors (try/except)
- Resource: freeCodeCamp "Python for Beginners" (YouTube, 4hr) + code along
- Mini-task: a CLI calculator + a "guess the number" game

### Week 2 · 21–27 Jul — Python for data
- [ ] `numpy`: arrays, slicing, vectorized math
- [ ] `pandas`: DataFrames, filtering, groupby, missing values
- [ ] `matplotlib`: line, bar, scatter plots
- Mini-task: load a CSV (grab one from Kaggle), clean it, plot 3 charts

### Week 3 · 28 Jul – 3 Aug — Math: Linear algebra + calculus intuition
- [ ] Vectors, matrices, dot product, matrix multiplication
- [ ] Derivatives & gradients (what they mean, not proofs)
- Resource: 3Blue1Brown "Essence of Linear Algebra" (YouTube)
- Mini-task: implement matrix multiply in pure Python, then check with numpy

### Week 4 · 4–10 Aug — Math: Probability & statistics
- [ ] Mean, median, variance, std deviation
- [ ] Distributions (normal), probability basics, Bayes' theorem
- [ ] Correlation vs causation
- Resource: Khan Academy Statistics & Probability
- Mini-task: compute summary stats on a dataset and interpret them

---

## Phase 1 — Core Machine Learning (11 Aug – 5 Oct)

**Goal:** Understand and apply classic ML with scikit-learn.
**Main resource:** Andrew Ng — *Machine Learning Specialization* (Coursera).

### Week 5 · 11–17 Aug — ML mindset + linear regression
- [ ] Supervised vs unsupervised learning
- [ ] Linear regression, cost function, gradient descent
- [ ] Train/test split
- **▶ Start Project 1: House Price Predictor** (see FIRST_PROJECTS.md / starter code)

### Week 6 · 18–24 Aug — Logistic regression + classification
- [ ] Logistic regression, sigmoid, decision boundary
- [ ] Metrics: accuracy, precision, recall, F1; confusion matrix
- Mini-task: predict pass/fail or spam/not-spam on a small dataset

### Week 7 · 25–31 Aug — Overfitting & model tuning
- [ ] Bias-variance tradeoff, underfit vs overfit
- [ ] Regularization (L1/L2)
- [ ] Cross-validation
- [ ] Feature scaling (normalization/standardization)

### Week 8 · 1–7 Sep — Trees & ensembles
- [ ] Decision trees
- [ ] Random forests, gradient boosting (XGBoost intro)
- [ ] Feature importance

### Week 9 · 8–14 Sep — More algorithms
- [ ] KNN, SVM, Naive Bayes (when to use each)
- [ ] Hyperparameter tuning (GridSearchCV)

### Week 10 · 15–21 Sep — Unsupervised learning
- [ ] K-means clustering
- [ ] PCA (dimensionality reduction)
- Mini-task: cluster customers or countries by features

### Week 11 · 22–28 Sep — Feature engineering + data cleaning
- [ ] Handling missing data, outliers
- [ ] Encoding categoricals (one-hot, label)
- [ ] Building a full sklearn Pipeline
- This is where real-world ML lives — spend real time here.

### Week 12 · 29 Sep – 5 Oct — First portfolio project (complete)
- [ ] Finish **House Price Predictor** end-to-end
- [ ] Clean README, notebook, and results on GitHub
- [ ] Write a short "what I learned" summary

---

## Phase 2 — Deep Learning (6 Oct – 30 Nov)

**Goal:** Build neural networks with PyTorch.
**Main resource:** Andrew Ng — *Deep Learning Specialization*, or fast.ai.

### Week 13 · 6–12 Oct — Neural network fundamentals
- [ ] Neurons, layers, weights, activations (ReLU, sigmoid, softmax)
- [ ] Forward pass, loss functions
- [ ] Backpropagation (intuition), optimizers (SGD, Adam)

### Week 14 · 13–19 Oct — PyTorch basics
- [ ] Tensors, autograd
- [ ] Build/train a simple feedforward network
- Mini-task: classify handwritten digits (MNIST)

### Week 15 · 20–26 Oct — CNNs part 1
- [ ] Convolution, pooling, filters
- [ ] Build a CNN image classifier
- **▶ Start Project 3: Image Classifier**

### Week 16 · 27 Oct – 2 Nov — CNNs part 2
- [ ] Train on a real dataset (cats/dogs or custom)
- [ ] Track accuracy per epoch, plot learning curves

### Week 17 · 3–9 Nov — Regularizing deep nets
- [ ] Dropout, batch norm, data augmentation
- [ ] Transfer learning (use a pretrained model — huge time saver)

### Week 18 · 10–16 Nov — Sequences & NLP
- [ ] Word embeddings, RNN/LSTM basics
- [ ] Text preprocessing

### Week 19 · 17–23 Nov — Transformers (LLM foundations)
- [ ] Attention mechanism + Transformers (the basis of ChatGPT)
- [ ] Use Hugging Face `transformers` for a text task
- Project seed: **Sentiment Analysis / Text Classifier**

### Week 20 · 24–30 Nov — Second portfolio project (complete)
- [ ] Finish the Image Classifier OR Text Classifier fully
- [ ] Deploy a demo on Hugging Face Spaces or Streamlit
- **▶ Pick your specialization track (see below)**

---

## Phase 3 — Engineering, Deployment & GenAI (1–28 Dec)

**Goal:** Ship models like an engineer, not just a notebook.

### Week 21 · 1–7 Dec — Software engineering for ML
- [ ] Git/GitHub workflow, clean project structure
- [ ] Virtual environments (`venv`/conda), `requirements.txt`
- [ ] Writing reusable, modular Python (not just notebooks)

### Week 22 · 8–14 Dec — APIs & deployment
- [ ] Build a REST API with FastAPI to serve a model
- [ ] Docker basics (containerize your app)
- [ ] Deploy to a free host (Render, Railway, HF Spaces)

### Week 23 · 15–21 Dec — LLMs & GenAI (the hot track)
- [ ] Call an LLM API (Claude / OpenAI)
- [ ] Prompt engineering basics
- [ ] Build a **RAG app**: document Q&A with embeddings + vector search
- **▶ Start Project 4: AI Chatbot / Document Q&A**

### Week 24 · 22–28 Dec — Capstone + job prep
- [ ] Build one polished **end-to-end capstone** (data → model → deployed app)
- [ ] Portfolio site + strong GitHub (pinned repos, good READMEs)
- [ ] Update resume/LinkedIn, start applying + Kaggle competitions

---

## Specialization track (pick by 30 Nov)
- **GenAI / LLMs** — most in-demand right now (RAG, agents, fine-tuning)
- **Computer Vision** — images, video, detection
- **Classical ML / Data Science** — tabular data, analytics-heavy roles

## How to know you're job-ready
- 3–5 solid projects on GitHub, at least 1 deployed and live
- Can explain your models and tradeoffs in an interview
- Comfortable with Python, sklearn, PyTorch, Git, and one deployment path
- Have done a few Kaggle competitions

---

*Consistency beats intensity — 1–2 focused hours daily wins. Keep this file updated.*
