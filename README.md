# Easy Statistic Analysis Tools v2.0.0

Professional Statistical Analysis Suite for Researchers  
Developed by นายจรัญญู ทองเอนก (Jarunyoo Thonganek)

---

## Quick Start (Local)

```bash
# 1. Install Node.js from https://nodejs.org (LTS version)

# 2. Clone or download this project

# 3. Install dependencies (first time only)
npm install

# 4. Run the app
npm start

# Or double-click run.bat on Windows
```

Open browser at **http://localhost:3000**  
Login: `thankyou` / `1234`

---

## Install from GitHub

### Option 1: Git Clone

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/EesyStatisticAnalysis.git

# 2. Go to the webapp folder
cd EesyStatisticAnalysis/webapp

# 3. Install dependencies
npm install

# 4. Start the app
npm start
```

### Option 2: Download ZIP

1. Go to the GitHub repository page
2. Click the green **Code** button
3. Click **Download ZIP**
4. Extract the ZIP file
5. Open a terminal/command prompt in the `webapp` folder
6. Run:
```bash
npm install
npm start
```

### Requirements

- **Node.js** version 16 or later ([download](https://nodejs.org))
- A modern web browser (Chrome, Firefox, Edge, Safari)
- Internet connection (for CDN libraries and AI features)

---

## Features

### Data Analysis
- Descriptive Statistics (Mean, S.D., S.E., 95% CI, Skewness, Kurtosis)
- Numeric / Nominal / Likert / Interval Analysis
- Outlier Detection (IQR method)
- Normality Test (Shapiro-Wilk, Kolmogorov-Smirnov)
- Dual-list variable picker for flexible selection

### Parametric Tests
- Independent Samples t-test (Levene's, Welch's, Cohen's d, 95% CI)
- Paired Samples t-test (with correlation, effect size)
- One-way ANOVA (with Tukey post-hoc, eta-squared)
- Two-way ANOVA
- Repeated Measures ANOVA
- ANCOVA
- Automatic assumption checking before each test

### Non-Parametric Tests
- Mann-Whitney U (with mean rank, Z, effect size r)
- Wilcoxon Signed-Rank (with rank summary)
- Kruskal-Wallis H (with post-hoc pairwise)
- Friedman (with Kendall's W, pairwise Wilcoxon)
- Chi-Square (with expected frequencies, Cramer's V)

### Advanced Analysis
- Correlation (Pearson, Spearman, Kendall) with assumption check
- Linear Regression (Durbin-Watson, VIF, standardized Beta, 95% CI)
- Logistic Regression (Wald, OR with 95% CI, classification table)
- Assumption Tests (Normality, Levene, VIF)
- Reliability (Cronbach's Alpha, item-total correlation)
- Effect Size (Cohen's d, Hedges' g, OR, RR with 95% CI)

### AI-Powered Features
- AI Statistical Chat (Google Gemini API)
- AI Chapter 4 Summary (Thai academic APA format)
- AI assumption recommendations
- Clean text output without markdown symbols

### Export
- Download results as Excel (.xlsx)
- Download results as Word (.doc)
- Sample data templates with Thai case studies

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Backend | Node.js + Express |
| Frontend | HTML + CSS + Vanilla JavaScript (SPA) |
| Statistics | jStat + custom implementations |
| Excel I/O | SheetJS (xlsx) |
| AI | Google Gemini API |

---

## Project Structure

```
webapp/
├── package.json          # npm dependencies
├── server.js             # Express server + AI proxy + template API
├── run.bat               # Windows double-click launcher
├── README.md             # This file
├── public/
│   ├── index.html        # Single Page Application
│   ├── css/
│   │   └── style.css     # Pastel blue corporate theme
│   └── js/
│       ├── app.js        # App logic, navigation, AI integration
│       └── stats.js      # Statistical computations (client-side)
└── _old_python/          # Previous Python/Streamlit version (backup)
```

---

## AI Setup

1. Get a free API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. In the app, go to **AI Settings**
3. Paste your API key and click **Save Settings**
4. Click **Test Connection** to verify
5. Use the **AI วิเคราะห์ผล** button on any analysis page

---

## Deploying to GitHub

```bash
# 1. Create a new repository on GitHub

# 2. Initialize git (if not already)
git init
git add .
git commit -m "Initial commit: Easy Statistic Analysis Tools v2.0.0"

# 3. Add your GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/EesyStatisticAnalysis.git

# 4. Push
git branch -M main
git push -u origin main
```

### Important: Create `.gitignore`

Make sure to create a `.gitignore` file:
```
node_modules/
_old_python/
.DS_Store
```

---

## License

Copyright (c) 2023-2026 นายจรัญญู ทองเอนก (Jarunyoo Thonganek)  
All Rights Reserved
