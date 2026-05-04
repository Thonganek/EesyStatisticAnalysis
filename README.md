# Easy Statistic Analysis Tools v2.1.0

Professional Statistical Analysis Suite for Researchers  
Developed by นายจรัญญู ทองเอนก (Jarunyoo Thonganek)

---

## สารบัญ

- [What's New](#whats-new)
- [วิธีติดตั้ง (Local)](#วิธีติดตั้ง-local)
- [วิธีติดตั้งจาก GitHub](#วิธีติดตั้งจาก-github)
- [วิธีเผยแพร่ออนไลน์ (Deploy)](#วิธีเผยแพร่ออนไลน์-deploy)
- [วิธีแก้ไขและอัปเดต](#วิธีแก้ไขและอัปเดต)
- [วิธีตั้งค่า AI](#วิธีตั้งค่า-ai)
- [คุณสมบัติทั้งหมด](#คุณสมบัติทั้งหมด)
- [โครงสร้างโปรเจค](#โครงสร้างโปรเจค)
- [การใช้งานเบื้องต้น](#การใช้งานเบื้องต้น)
- [แก้ปัญหาที่พบบ่อย](#แก้ปัญหาที่พบบ่อย)
- [License](#license)

---

## What's New

### v2.1.0 (พฤษภาคม 2026) — Statistical Accuracy Overhaul

การอัปเดตครั้งใหญ่เพื่อความถูกต้องของการคำนวณสถิติ ครอบคลุมทุกเมนูหลัก

**การแก้ไขสำคัญ (stats.js)**

| รายการ | สิ่งที่แก้ไข |
|--------|------------|
| **Listwise Deletion** | แก้ bug row misalignment เมื่อข้อมูลมี missing values — ทุกฟังก์ชันใช้แถวเดียวกันแทนการ slice ทีละคอลัมน์ |
| **Correlation** | Pairwise deletion ที่ถูกต้อง: จับคู่ตำแหน่งเดียวกัน ไม่ใช่ clean+slice แยก |
| **Linear Regression** | ลบ silent `\|\| 0` สำหรับ missing values ที่ทำให้โมเดลเพี้ยน |
| **Logistic Regression** | Auto-encode DV เป็น 0/1 อัตโนมัติ รองรับค่า 1/2 หรือค่าอื่น |
| **Partial Correlation** | เปลี่ยนเป็น simultaneous OLS แทน sequential regression ที่ขึ้นกับลำดับ |
| **Mann-Whitney U** | เพิ่ม tie correction ใน variance (สูตร Hollander-Wolfe) |
| **Kruskal-Wallis** | เพิ่ม tie correction: `H / (1 − Σ(t³−t)/(N³−N))` |
| **Wilcoxon Signed-Rank** | เพิ่ม tie correction ใน σ_W, effect size ใช้ `n_eff` แทน `n` |
| **Friedman** | เพิ่ม Conover tie correction |
| **Kaplan-Meier** | Greenwood SE ใช้ cumulative sum ทุก event time (ไม่ใช่แค่ event ปัจจุบัน) |
| **Log-Rank Test** | เปลี่ยนสูตรเป็น `(O−E)²/Var` ตามมาตรฐาน (Var = `Σ n₁n₂d(n−d)/n²(n−1)`) |
| **Cox Regression** | แทนที่ median-split ด้วย partial likelihood จริง (Breslow, Newton-Raphson) |
| **Runs Test** | ใช้ median แทน mean ตามมาตรฐาน Wald-Wolfowitz |
| **Games-Howell** | ใช้ studentized range distribution แทน uncorrected t-test |
| **Tukey HSD** | ใช้ `jStat.studentizedRange.cdf` แทน double Bonferroni correction |
| **KMO** | คำนวณ partial correlations จาก inverse ของ correlation matrix แทนค่าประดิษฐ์ |

---

## วิธีติดตั้ง (Local)

### สิ่งที่ต้องมี

- **Node.js** v16 ขึ้นไป — ดาวน์โหลดที่ [nodejs.org](https://nodejs.org)
- **Browser** อะไรก็ได้ (Chrome, Firefox, Edge)

### ขั้นตอน

```bash
# 1. เปิด Terminal / Command Prompt

# 2. เข้าโฟลเดอร์โปรเจค
cd d:/python/EesyStatisticAnalysis/webapp

# 3. ติดตั้ง dependencies (ครั้งแรกครั้งเดียว)
npm install

# 4. รันแอป
npm start
```

เปิดเบราว์เซอร์ที่ **http://localhost:3000**

Login: `thankyou` / `1234`

### สำหรับ Windows

Double-click ไฟล์ `run.bat` ได้เลย

---

## วิธีติดตั้งจาก GitHub

### วิธีที่ 1: Git Clone

```bash
# 1. Clone โปรเจค
git clone https://github.com/Thonganek/EesyStatisticAnalysis.git

# 2. เข้าโฟลเดอร์
cd EesyStatisticAnalysis

# 3. ติดตั้ง dependencies
npm install

# 4. รัน
npm start
```

### วิธีที่ 2: Download ZIP (ไม่ต้องใช้ Git)

1. ไปที่ https://github.com/Thonganek/EesyStatisticAnalysis
2. กดปุ่มเขียว **Code** → **Download ZIP**
3. แตกไฟล์ ZIP
4. เปิด Terminal ในโฟลเดอร์ที่แตกออกมา
5. รัน:

```bash
npm install
npm start
```

---

## วิธีเผยแพร่ออนไลน์ (Deploy)

ให้คนอื่นเข้าใช้ผ่านเว็บได้เลย ไม่ต้องติดตั้งอะไร

### วิธีที่ 1: Render.com (แนะนำ, ฟรี)

#### ขั้นตอนที่ 1: สมัคร

1. เปิด https://render.com
2. กด **Get Started for Free**
3. เลือก **Sign up with GitHub**
4. อนุญาตให้ Render เข้าถึง GitHub

#### ขั้นตอนที่ 2: สร้าง Web Service

1. กดปุ่ม **New +** (มุมขวาบน) → **Web Service**
2. เลือก **Build and deploy from a Git repository** → Next
3. เลือก repo **Thonganek/EesyStatisticAnalysis** → **Connect**

#### ขั้นตอนที่ 3: ตั้งค่า

| ช่อง | ใส่ |
|------|-----|
| Name | `eesy-stat` |
| Region | Singapore (Southeast Asia) |
| Branch | `main` |
| Runtime | `Node` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance Type | **Free** |

#### ขั้นตอนที่ 4: Deploy

1. กด **Create Web Service**
2. รอ 2-3 นาที จนขึ้น **"Your service is live"**
3. ได้ลิงก์ เช่น `https://eesy-stat.onrender.com`
4. แชร์ลิงก์นี้ให้ใครก็ได้!

### วิธีที่ 2: Vercel (ฟรี, เร็วมาก)

1. ไปที่ https://vercel.com → Sign up with GitHub
2. กด **Import Project** → เลือก **EesyStatisticAnalysis**
3. กด **Deploy**
4. ได้ลิงก์ เช่น `https://eesy-stat.vercel.app`

### วิธีที่ 3: Railway.app (ฟรี 500 ชม./เดือน)

1. ไปที่ https://railway.app → Sign up with GitHub
2. กด **New Project** → **Deploy from GitHub repo**
3. เลือก **EesyStatisticAnalysis**
4. Railway deploy อัตโนมัติ → ได้ลิงก์

### เปรียบเทียบ

| | Render | Vercel | Railway |
|---|---|---|---|
| ราคา | ฟรี | ฟรี | ฟรี 500 ชม. |
| ความเร็ว | ปานกลาง | เร็วมาก | เร็ว |
| หลับ (sleep) | หลังไม่ใช้ 15 นาที | ไม่หลับ | ไม่หลับ |
| ง่าย | ง่ายมาก | ง่ายมาก | ง่าย |

---

## วิธีแก้ไขและอัปเดต

### ขั้นตอน

```bash
# 1. แก้ไขโค้ดตามต้องการ

# 2. เข้าโฟลเดอร์โปรเจค
cd d:/python/EesyStatisticAnalysis/webapp

# 3. Add + Commit + Push
git add .
git commit -m "อธิบายสิ่งที่แก้ไข"
git push
```

Render / Vercel / Railway จะ **auto deploy** ภายใน 2-3 นาที

### ถ้า git push แล้ว error เรื่อง token

1. สร้าง Personal Access Token ใหม่:
   - ไปที่ https://github.com/settings/tokens/new
   - Note: `EesyStat`
   - ติ๊ก **repo**
   - กด Generate token
   - คัดลอก token (ghp_...)

2. อัปเดต remote URL:

```bash
git remote set-url origin https://Thonganek:TOKEN_ใหม่@github.com/Thonganek/EesyStatisticAnalysis.git
git push
```

---

## วิธีตั้งค่า AI

แอปใช้ **Google Gemini API** สำหรับ AI วิเคราะห์ผลและ AI Chat

### ขั้นตอน

1. ไปที่ https://aistudio.google.com/apikey
2. Login ด้วย Google Account
3. กด **Create API Key** (ฟรี)
4. คัดลอก API Key

### ตั้งค่าในแอป

1. เข้าแอป → เมนู **AI Settings**
2. วาง API Key ในช่อง
3. เลือก Model:
   - `gemini-2.5-flash-lite` — เร็ว ประหยัด
   - `gemini-2.5-flash` — สมดุล (แนะนำ)
   - `gemini-2.5-pro` — แม่นยำสูง
4. กด **Save Settings**
5. กด **Test Connection** เพื่อทดสอบ

### การใช้งาน AI

- **AI วิเคราะห์ผล** — กดปุ่ม "AI วิเคราะห์ผล" ในทุกหน้าวิเคราะห์ เลือกรูปแบบ:
  - บทที่ 4 เชิงวิชาการ (APA)
  - บทคัดย่อ สรุปสั้น
  - หมายเหตุใต้ตาราง
  - สไลด์นำเสนอ
  - อธิบายให้เข้าใจง่าย
- **AI Chat** — คลิก "AI Statistical Chat" ในเมนูซ้าย ถาม-ตอบเรื่องสถิติได้

---

## คุณสมบัติทั้งหมด

### Data Analysis (วิเคราะห์ข้อมูลเบื้องต้น)

| เครื่องมือ | รายละเอียด |
|-----------|-----------|
| Demographics | ตารางคุณลักษณะส่วนบุคคล n/% พร้อม Mean±SD สำหรับตัวแปร Numeric |
| Descriptive | Mean, S.D., S.E., Median, Mode, 95% CI, Skewness, Kurtosis, Min/Max |
| Numeric | วิเคราะห์ตัวแปรเชิงปริมาณ Histogram |
| Nominal | ความถี่ ร้อยละ Cumulative% Bar Chart |
| Likert Scale | 5/3 ระดับ จัดกลุ่มตาม Dimension ตั้งเกณฑ์แปลผลได้ จัดอันดับ |
| Interval | จัดกลุ่มช่วงต่อเนื่อง หลายตัวแปร ตั้งค่า popup |
| Outlier | ตรวจค่าผิดปกติด้วย IQR (Box plot method) |
| Normality | Shapiro-Wilk (n≤50), Kolmogorov-Smirnov |
| Missing Data | สรุป missing ทุกตัวแปร % missing |
| Z-Score | แปลงเป็น z-score ทุกตัวแปร |

### Parametric Tests (สถิติ Parametric)

| สถิติ | ใช้เมื่อ | ผลลัพธ์ |
|-------|---------|---------|
| One-Sample t-test | เปรียบเทียบกับค่าคงที่ | t, df, p, 95% CI, Cohen's d |
| Independent t-test | เปรียบเทียบ 2 กลุ่มอิสระ | t, df, Mean Diff, p, 95% CI, Cohen's d, Welch |
| Paired t-test | เปรียบเทียบก่อน-หลัง | t, df, Mean Diff, p, 95% CI, Cohen's d |
| One-way ANOVA | เปรียบเทียบ 3+ กลุ่ม | F, p, η², Post-hoc (Tukey/Bonferroni/Scheffe) |
| Two-way ANOVA | 2 ปัจจัย + ปฏิสัมพันธ์ | F, p, η² |
| RM-ANOVA | วัดซ้ำ 3+ ครั้ง | F, p, Pairwise |
| Welch ANOVA | ANOVA ไม่เท่ากัน variance | F, p, Games-Howell |
| ANCOVA | ควบคุมตัวแปรร่วม | F, p, Adjusted Means |
| MANOVA | หลาย DV พร้อมกัน | Pillai's trace, F, p |

### Non-Parametric Tests (สถิติ Non-Parametric)

| สถิติ | ใช้แทน | ผลลัพธ์ |
|-------|--------|---------|
| Sign Test | One-sample / Paired | S, p |
| Binomial Test | ทดสอบสัดส่วน | p (exact) |
| Mann-Whitney U | Independent t-test | U, Z, p, r (tie-corrected) |
| Wilcoxon Signed-Rank | Paired t-test | W, Z, p, r (tie-corrected) |
| Kruskal-Wallis | One-way ANOVA | H, p, η² (tie-corrected) |
| Friedman | RM-ANOVA | χ², p, Kendall's W (tie-corrected) |
| Cochran's Q | RM สำหรับ binary | Q, p |
| Chi-Square | ความสัมพันธ์ตัวแปรกลุ่ม | χ², p, Cramer's V, Phi, Residuals |
| Fisher's Exact | Chi-square ตัวอย่างน้อย | p (exact) |
| McNemar | เปรียบเทียบ paired proportion | χ², p |
| Median Test | เปรียบเทียบ median หลายกลุ่ม | χ², p |
| Runs Test | ทดสอบ randomness (Wald-Wolfowitz) | Runs, Z, p |
| KS 2-Sample | เปรียบเทียบ 2 distributions | D, p |

### Regression & Correlation

| เครื่องมือ | รายละเอียด |
|-----------|-----------|
| Pearson / Spearman / Kendall | Correlation matrix, r, p, R², Heatmap |
| Partial Correlation | ควบคุม confounds ด้วย simultaneous OLS |
| Linear / Multiple Regression | R², Adj-R², F, Beta, SE, t, p, 95% CI, Durbin-Watson |
| Stepwise / Forward / Backward | Variable selection อัตโนมัติ |
| Logistic Regression | OR, Wald, AIC, Classification Table (DV auto-encode 0/1) |
| Hierarchical Regression | R² change, F-change ทีละ Block |
| ROC Analysis | AUC, Youden's J, Optimal cutoff |
| Path Analysis | Direct/Indirect/Total effects |

### Advanced Analysis

| เครื่องมือ | รายละเอียด |
|-----------|-----------|
| Reliability (Cronbach's α) | Alpha, Item-Total r, Alpha if Deleted, Mean, S.D. |
| Split-Half | Spearman-Brown, Guttman |
| Item Analysis | Difficulty, Discrimination index |
| Factor Analysis (EFA) | Eigenvalue, % Variance, KMO (proper matrix inversion) |
| CFA (Simplified) | Factor loadings |
| ICC | Two-way mixed/random, absolute/consistency |
| Cohen's Kappa | Inter-rater agreement |
| Discriminant Analysis | Classification functions |
| Cluster Analysis | K-means grouping |
| Bootstrap CI | Mean, Median, SD bootstrap |

### Post-Hoc Tests

| สถิติ | ใช้กับ | หมายเหตุ |
|-------|--------|---------|
| Tukey HSD | Equal variance | studentized range distribution |
| Games-Howell | Unequal variance | studentized range + Welch df |
| Bonferroni | ทุกกรณี | conservative |
| Scheffe | ทุกกรณี | most conservative |
| Fisher LSD | No correction | |
| Dunnett | Compare to control | |

### Survival Analysis

| เครื่องมือ | รายละเอียด |
|-----------|-----------|
| Kaplan-Meier | Survival curve, Greenwood SE (cumulative), Median survival |
| Log-Rank Test | เปรียบเทียบ 2 กลุ่ม ด้วย variance-based formula |
| Cox Regression | Partial likelihood (Breslow approximation), HR, 95% CI, Wald |

### Sample Size & Power

| เครื่องมือ | รายละเอียด |
|-----------|-----------|
| Sample Size | t-test, ANOVA, Chi-square, Regression, Proportion |
| Power Analysis | Post-hoc power for major tests |
| Effect Size Calculator | Cohen's d, Hedges' g, OR, RR, Eta², R² |

### Assumption Checking

| การตรวจสอบ | รายละเอียด |
|-----------|-----------|
| Normality | Shapiro-Wilk / K-S อัตโนมัติ |
| Homogeneity | Levene's test |
| Multicollinearity | VIF (Variance Inflation Factor) |
| Assumption Check | ตรวจอัตโนมัติก่อนทุกสถิติ พร้อมคำแนะนำ |

### AI Features

| ฟีเจอร์ | รายละเอียด |
|---------|-----------|
| AI วิเคราะห์ผล | สรุปผลวิจัย 5 รูปแบบ (บทที่ 4, บทคัดย่อ, ตาราง, สไลด์, ภาษาง่าย) |
| AI Chat | ถาม-ตอบเรื่องสถิติ แนะนำการเลือกสถิติที่เหมาะสม |
| AI Research Search | ค้นหาอ้างอิง Cohen's d, G*Power พร้อมลิงก์ |

### Export & Templates

| ฟีเจอร์ | รายละเอียด |
|---------|-----------|
| Export Excel | ดาวน์โหลดผลวิเคราะห์เป็น .xlsx |
| Export Word | ดาวน์โหลดเป็น .doc พร้อมผล AI |
| Sample Templates | ข้อมูลตัวอย่าง + กรณีศึกษา ทุกสถิติ |
| Charts | Bar, Line, Scatter, Box Plot, Histogram, QQ Plot |

---

## โครงสร้างโปรเจค

```
EesyStatisticAnalysis/
├── package.json          # npm dependencies
├── server.js             # Express server + AI proxy + Template API
├── run.bat               # Windows launcher (double-click)
├── README.md             # ไฟล์นี้
├── .gitignore            # ไฟล์ที่ไม่อัปขึ้น GitHub
├── public/
│   ├── index.html        # หน้าเว็บหลัก (Single Page App)
│   ├── qrcode.jpg        # QR Code LINE
│   ├── developer.png     # รูปผู้พัฒนา
│   ├── css/
│   │   └── style.css     # Stylesheet (Pastel Blue Theme)
│   └── js/
│       ├── app.js        # Logic หลัก (navigation, AI, export, listwise deletion)
│       └── stats.js      # คำนวณสถิติทั้งหมด (client-side, 50+ functions)
└── resources/
    ├── qrcode.jpg
    └── developer.png
```

### Tech Stack

| ส่วน | เทคโนโลยี |
|------|----------|
| Backend | Node.js + Express |
| Frontend | HTML + CSS + JavaScript (SPA) |
| Statistics | jStat + Custom implementations (stats.js) |
| Excel I/O | SheetJS (xlsx) |
| AI | Google Gemini API |

---

## การใช้งานเบื้องต้น

### 1. Login
- Username: `thankyou`
- Password: `1234`

### 2. Upload ข้อมูล
- คลิก "Upload Data (.xlsx)" ในเมนูซ้าย
- เลือกไฟล์ Excel (.xlsx)
- ระบบจะอ่านข้อมูลและแสดง preview

### 3. เลือกการวิเคราะห์
- เลือกเมนูสถิติที่ต้องการจาก sidebar
- กดปุ่ม "เลือกตัวแปร" → popup แสดงตัวแปร → กดเลือก → ตกลง
- กด "Run Analysis"

### 4. ดูผลลัพธ์
- ตาราง Assumption Check แสดงก่อน (ตรวจข้อตกลง)
- ตารางผลวิเคราะห์หลัก
- กดปุ่ม "AI วิเคราะห์ผล" เพื่อสรุปผลอัตโนมัติ
- กด Download Excel / Word เพื่อส่งออก

### 5. เลือกตัวแปร (Popup)
- กดปุ่ม "เลือกตัวแปร" → Popup เปิดขึ้น
- กดที่ชื่อตัวแปร → เปลี่ยนเป็นสีน้ำเงิน (เลือกแล้ว)
- กดอีกครั้ง → ยกเลิกการเลือก
- ปุ่ม "เลือกทั้งหมด" / "ยกเลิกทั้งหมด"
- กด "ตกลง" → ตัวแปรที่เลือกแสดงเป็น tag

### 6. Missing Data
- ระบบใช้ **Listwise Deletion** อัตโนมัติ — แถวที่ตัวแปรใดตัวหนึ่งขาดหายจะถูกตัดออกจากทุกตัวแปรพร้อมกัน
- Correlation ใช้ **Pairwise Deletion** — จับคู่ตำแหน่งเดียวกันในแต่ละคู่ตัวแปร

---

## แก้ปัญหาที่พบบ่อย

### npm start แล้วไม่ขึ้น

```bash
# ตรวจสอบว่าติดตั้ง Node.js แล้ว
node --version

# ถ้ายังไม่ติดตั้ง ไปดาวน์โหลดที่ nodejs.org

# ติดตั้ง dependencies ใหม่
npm install
npm start
```

### Port 3000 ถูกใช้งานอยู่

```bash
# Windows: หา process ที่ใช้ port 3000
netstat -ano | findstr :3000

# Kill process (แทน PID ด้วยเลขที่เจอ)
taskkill /PID เลข /F

# รันใหม่
npm start
```

### AI ใช้งานไม่ได้

1. ตรวจสอบว่าใส่ API Key แล้ว (AI Settings)
2. กด Test Connection
3. ถ้า error: สร้าง API Key ใหม่ที่ https://aistudio.google.com/apikey
4. ตรวจสอบ internet connection

### Logistic Regression แสดง error

- ตรวจสอบว่า DV มีเพียง **2 ค่า** (binary) เท่านั้น
- ระบบจะ auto-encode ค่าที่น้อยกว่า → 0 และค่าที่มากกว่า → 1 โดยอัตโนมัติ

### git push error

```bash
# สร้าง token ใหม่ที่ github.com/settings/tokens/new (ติ๊ก repo)
git remote set-url origin https://Thonganek:TOKEN_ใหม่@github.com/Thonganek/EesyStatisticAnalysis.git
git push
```

---

## Changelog

| Version | วันที่ | รายการ |
|---------|--------|--------|
| v2.1.0 | พ.ค. 2026 | Statistical accuracy overhaul — tie corrections, Cox PH, Greenwood SE, log-rank, listwise deletion, partial correlation, logistic DV encoding |
| v2.0.0 | 2025 | Full rewrite เป็น Node.js SPA, AI integration, 50+ statistical tests |

---

## License

Copyright (c) 2023-2026 นายจรัญญู ทองเอนก (Jarunyoo Thonganek)  
All Rights Reserved
