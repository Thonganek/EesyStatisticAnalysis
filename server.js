const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const XLSX = require('xlsx');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ---------------------------------------------------------------------------
// Template data for each statistical test type
// ---------------------------------------------------------------------------
const TEMPLATES = {
  independent_ttest: {
    name: 'Independent Samples t-Test',
    columns: ['ID', 'Group', 'Score'],
    data: [
      { ID: 1, Group: 'A', Score: 78 },
      { ID: 2, Group: 'A', Score: 85 },
      { ID: 3, Group: 'A', Score: 72 },
      { ID: 4, Group: 'A', Score: 90 },
      { ID: 5, Group: 'A', Score: 68 },
      { ID: 6, Group: 'A', Score: 82 },
      { ID: 7, Group: 'A', Score: 76 },
      { ID: 8, Group: 'A', Score: 88 },
      { ID: 9, Group: 'A', Score: 74 },
      { ID: 10, Group: 'A', Score: 80 },
      { ID: 11, Group: 'B', Score: 65 },
      { ID: 12, Group: 'B', Score: 70 },
      { ID: 13, Group: 'B', Score: 62 },
      { ID: 14, Group: 'B', Score: 75 },
      { ID: 15, Group: 'B', Score: 58 },
      { ID: 16, Group: 'B', Score: 72 },
      { ID: 17, Group: 'B', Score: 66 },
      { ID: 18, Group: 'B', Score: 78 },
      { ID: 19, Group: 'B', Score: 60 },
      { ID: 20, Group: 'B', Score: 69 }
    ]
  },

  paired_ttest: {
    name: 'Paired Samples t-Test',
    columns: ['ID', 'Pretest', 'Posttest'],
    data: [
      { ID: 1, Pretest: 55, Posttest: 70 },
      { ID: 2, Pretest: 60, Posttest: 75 },
      { ID: 3, Pretest: 48, Posttest: 65 },
      { ID: 4, Pretest: 72, Posttest: 80 },
      { ID: 5, Pretest: 65, Posttest: 78 },
      { ID: 6, Pretest: 50, Posttest: 68 },
      { ID: 7, Pretest: 58, Posttest: 72 },
      { ID: 8, Pretest: 62, Posttest: 76 },
      { ID: 9, Pretest: 45, Posttest: 60 },
      { ID: 10, Pretest: 70, Posttest: 82 },
      { ID: 11, Pretest: 53, Posttest: 67 },
      { ID: 12, Pretest: 67, Posttest: 79 },
      { ID: 13, Pretest: 42, Posttest: 58 },
      { ID: 14, Pretest: 75, Posttest: 85 },
      { ID: 15, Pretest: 61, Posttest: 74 }
    ]
  },

  oneway_anova: {
    name: 'One-Way ANOVA',
    columns: ['ID', 'Method', 'Score'],
    data: [
      { ID: 1, Method: 'A', Score: 82 },
      { ID: 2, Method: 'A', Score: 78 },
      { ID: 3, Method: 'A', Score: 85 },
      { ID: 4, Method: 'A', Score: 80 },
      { ID: 5, Method: 'A', Score: 76 },
      { ID: 6, Method: 'A', Score: 84 },
      { ID: 7, Method: 'A', Score: 79 },
      { ID: 8, Method: 'A', Score: 88 },
      { ID: 9, Method: 'A', Score: 81 },
      { ID: 10, Method: 'A', Score: 77 },
      { ID: 11, Method: 'B', Score: 70 },
      { ID: 12, Method: 'B', Score: 65 },
      { ID: 13, Method: 'B', Score: 72 },
      { ID: 14, Method: 'B', Score: 68 },
      { ID: 15, Method: 'B', Score: 74 },
      { ID: 16, Method: 'B', Score: 66 },
      { ID: 17, Method: 'B', Score: 71 },
      { ID: 18, Method: 'B', Score: 69 },
      { ID: 19, Method: 'B', Score: 73 },
      { ID: 20, Method: 'B', Score: 67 },
      { ID: 21, Method: 'C', Score: 90 },
      { ID: 22, Method: 'C', Score: 88 },
      { ID: 23, Method: 'C', Score: 92 },
      { ID: 24, Method: 'C', Score: 86 },
      { ID: 25, Method: 'C', Score: 94 },
      { ID: 26, Method: 'C', Score: 89 },
      { ID: 27, Method: 'C', Score: 91 },
      { ID: 28, Method: 'C', Score: 87 },
      { ID: 29, Method: 'C', Score: 93 },
      { ID: 30, Method: 'C', Score: 85 }
    ]
  },

  mann_whitney: {
    name: 'Mann-Whitney U Test',
    columns: ['ID', 'Group', 'Rating'],
    data: [
      { ID: 1, Group: 'A', Rating: 4 },
      { ID: 2, Group: 'A', Rating: 5 },
      { ID: 3, Group: 'A', Rating: 3 },
      { ID: 4, Group: 'A', Rating: 4 },
      { ID: 5, Group: 'A', Rating: 5 },
      { ID: 6, Group: 'A', Rating: 4 },
      { ID: 7, Group: 'A', Rating: 3 },
      { ID: 8, Group: 'A', Rating: 5 },
      { ID: 9, Group: 'A', Rating: 4 },
      { ID: 10, Group: 'A', Rating: 4 },
      { ID: 11, Group: 'B', Rating: 2 },
      { ID: 12, Group: 'B', Rating: 3 },
      { ID: 13, Group: 'B', Rating: 1 },
      { ID: 14, Group: 'B', Rating: 3 },
      { ID: 15, Group: 'B', Rating: 2 },
      { ID: 16, Group: 'B', Rating: 4 },
      { ID: 17, Group: 'B', Rating: 2 },
      { ID: 18, Group: 'B', Rating: 3 },
      { ID: 19, Group: 'B', Rating: 1 },
      { ID: 20, Group: 'B', Rating: 3 }
    ]
  },

  wilcoxon: {
    name: 'Wilcoxon Signed-Rank Test',
    columns: ['ID', 'Before', 'After'],
    data: [
      { ID: 1, Before: 3, After: 4 },
      { ID: 2, Before: 2, After: 4 },
      { ID: 3, Before: 4, After: 5 },
      { ID: 4, Before: 1, After: 3 },
      { ID: 5, Before: 3, After: 4 },
      { ID: 6, Before: 2, After: 3 },
      { ID: 7, Before: 3, After: 5 },
      { ID: 8, Before: 4, After: 4 },
      { ID: 9, Before: 2, After: 4 },
      { ID: 10, Before: 1, After: 3 },
      { ID: 11, Before: 3, After: 5 },
      { ID: 12, Before: 2, After: 4 },
      { ID: 13, Before: 4, After: 5 },
      { ID: 14, Before: 3, After: 4 },
      { ID: 15, Before: 2, After: 3 }
    ]
  },

  kruskal_wallis: {
    name: 'Kruskal-Wallis H Test',
    columns: ['ID', 'Group', 'Rating'],
    data: [
      { ID: 1, Group: 'A', Rating: 5 },
      { ID: 2, Group: 'A', Rating: 4 },
      { ID: 3, Group: 'A', Rating: 5 },
      { ID: 4, Group: 'A', Rating: 4 },
      { ID: 5, Group: 'A', Rating: 5 },
      { ID: 6, Group: 'A', Rating: 3 },
      { ID: 7, Group: 'A', Rating: 4 },
      { ID: 8, Group: 'A', Rating: 5 },
      { ID: 9, Group: 'A', Rating: 4 },
      { ID: 10, Group: 'A', Rating: 5 },
      { ID: 11, Group: 'B', Rating: 3 },
      { ID: 12, Group: 'B', Rating: 2 },
      { ID: 13, Group: 'B', Rating: 3 },
      { ID: 14, Group: 'B', Rating: 4 },
      { ID: 15, Group: 'B', Rating: 2 },
      { ID: 16, Group: 'B', Rating: 3 },
      { ID: 17, Group: 'B', Rating: 3 },
      { ID: 18, Group: 'B', Rating: 2 },
      { ID: 19, Group: 'B', Rating: 4 },
      { ID: 20, Group: 'B', Rating: 3 },
      { ID: 21, Group: 'C', Rating: 1 },
      { ID: 22, Group: 'C', Rating: 2 },
      { ID: 23, Group: 'C', Rating: 1 },
      { ID: 24, Group: 'C', Rating: 3 },
      { ID: 25, Group: 'C', Rating: 2 },
      { ID: 26, Group: 'C', Rating: 1 },
      { ID: 27, Group: 'C', Rating: 2 },
      { ID: 28, Group: 'C', Rating: 1 },
      { ID: 29, Group: 'C', Rating: 3 },
      { ID: 30, Group: 'C', Rating: 2 }
    ]
  },

  chi_square: {
    name: 'Chi-Square Test',
    columns: ['ID', 'Gender', 'Satisfaction'],
    data: [
      { ID: 1, Gender: 'Male', Satisfaction: 'High' },
      { ID: 2, Gender: 'Male', Satisfaction: 'Medium' },
      { ID: 3, Gender: 'Male', Satisfaction: 'High' },
      { ID: 4, Gender: 'Male', Satisfaction: 'Low' },
      { ID: 5, Gender: 'Male', Satisfaction: 'High' },
      { ID: 6, Gender: 'Male', Satisfaction: 'Medium' },
      { ID: 7, Gender: 'Male', Satisfaction: 'High' },
      { ID: 8, Gender: 'Male', Satisfaction: 'Medium' },
      { ID: 9, Gender: 'Male', Satisfaction: 'Low' },
      { ID: 10, Gender: 'Male', Satisfaction: 'High' },
      { ID: 11, Gender: 'Male', Satisfaction: 'Medium' },
      { ID: 12, Gender: 'Male', Satisfaction: 'High' },
      { ID: 13, Gender: 'Male', Satisfaction: 'Low' },
      { ID: 14, Gender: 'Male', Satisfaction: 'Medium' },
      { ID: 15, Gender: 'Male', Satisfaction: 'High' },
      { ID: 16, Gender: 'Female', Satisfaction: 'Medium' },
      { ID: 17, Gender: 'Female', Satisfaction: 'High' },
      { ID: 18, Gender: 'Female', Satisfaction: 'Medium' },
      { ID: 19, Gender: 'Female', Satisfaction: 'Medium' },
      { ID: 20, Gender: 'Female', Satisfaction: 'Low' },
      { ID: 21, Gender: 'Female', Satisfaction: 'High' },
      { ID: 22, Gender: 'Female', Satisfaction: 'Medium' },
      { ID: 23, Gender: 'Female', Satisfaction: 'Low' },
      { ID: 24, Gender: 'Female', Satisfaction: 'Medium' },
      { ID: 25, Gender: 'Female', Satisfaction: 'High' },
      { ID: 26, Gender: 'Female', Satisfaction: 'Medium' },
      { ID: 27, Gender: 'Female', Satisfaction: 'Low' },
      { ID: 28, Gender: 'Female', Satisfaction: 'Medium' },
      { ID: 29, Gender: 'Female', Satisfaction: 'High' },
      { ID: 30, Gender: 'Female', Satisfaction: 'Medium' }
    ]
  },

  correlation: {
    name: 'Correlation Analysis',
    columns: ['ID', 'Hours_Study', 'GPA'],
    data: [
      { ID: 1, Hours_Study: 2, GPA: 2.10 },
      { ID: 2, Hours_Study: 4, GPA: 2.80 },
      { ID: 3, Hours_Study: 6, GPA: 3.20 },
      { ID: 4, Hours_Study: 3, GPA: 2.50 },
      { ID: 5, Hours_Study: 8, GPA: 3.60 },
      { ID: 6, Hours_Study: 5, GPA: 3.00 },
      { ID: 7, Hours_Study: 7, GPA: 3.50 },
      { ID: 8, Hours_Study: 1, GPA: 1.80 },
      { ID: 9, Hours_Study: 9, GPA: 3.80 },
      { ID: 10, Hours_Study: 4, GPA: 2.70 },
      { ID: 11, Hours_Study: 6, GPA: 3.10 },
      { ID: 12, Hours_Study: 3, GPA: 2.40 },
      { ID: 13, Hours_Study: 10, GPA: 3.90 },
      { ID: 14, Hours_Study: 5, GPA: 3.00 },
      { ID: 15, Hours_Study: 7, GPA: 3.40 },
      { ID: 16, Hours_Study: 2, GPA: 2.20 },
      { ID: 17, Hours_Study: 8, GPA: 3.70 },
      { ID: 18, Hours_Study: 4, GPA: 2.60 },
      { ID: 19, Hours_Study: 6, GPA: 3.30 },
      { ID: 20, Hours_Study: 1, GPA: 1.90 }
    ]
  },

  linear_regression: {
    name: 'Linear Regression',
    columns: ['ID', 'X1', 'X2', 'Y'],
    data: [
      { ID: 1, X1: 3, X2: 5, Y: 45 },
      { ID: 2, X1: 5, X2: 7, Y: 62 },
      { ID: 3, X1: 7, X2: 4, Y: 55 },
      { ID: 4, X1: 4, X2: 6, Y: 50 },
      { ID: 5, X1: 8, X2: 8, Y: 78 },
      { ID: 6, X1: 6, X2: 3, Y: 48 },
      { ID: 7, X1: 2, X2: 9, Y: 52 },
      { ID: 8, X1: 9, X2: 6, Y: 72 },
      { ID: 9, X1: 5, X2: 5, Y: 55 },
      { ID: 10, X1: 7, X2: 7, Y: 68 },
      { ID: 11, X1: 3, X2: 8, Y: 50 },
      { ID: 12, X1: 6, X2: 4, Y: 52 },
      { ID: 13, X1: 8, X2: 9, Y: 82 },
      { ID: 14, X1: 4, X2: 3, Y: 40 },
      { ID: 15, X1: 10, X2: 7, Y: 85 },
      { ID: 16, X1: 2, X2: 6, Y: 42 },
      { ID: 17, X1: 7, X2: 5, Y: 60 },
      { ID: 18, X1: 5, X2: 8, Y: 62 },
      { ID: 19, X1: 9, X2: 4, Y: 65 },
      { ID: 20, X1: 6, X2: 6, Y: 58 }
    ]
  },

  likert_5: {
    name: 'Likert Scale (5-point)',
    columns: ['ID', 'Item1', 'Item2', 'Item3', 'Item4', 'Item5'],
    data: [
      { ID: 1, Item1: 4, Item2: 5, Item3: 3, Item4: 4, Item5: 5 },
      { ID: 2, Item1: 3, Item2: 4, Item3: 4, Item4: 3, Item5: 4 },
      { ID: 3, Item1: 5, Item2: 5, Item3: 5, Item4: 5, Item5: 5 },
      { ID: 4, Item1: 2, Item2: 3, Item3: 3, Item4: 2, Item5: 3 },
      { ID: 5, Item1: 4, Item2: 4, Item3: 4, Item4: 4, Item5: 4 },
      { ID: 6, Item1: 3, Item2: 3, Item3: 2, Item4: 3, Item5: 3 },
      { ID: 7, Item1: 5, Item2: 4, Item3: 5, Item4: 4, Item5: 5 },
      { ID: 8, Item1: 4, Item2: 5, Item3: 4, Item4: 5, Item5: 4 },
      { ID: 9, Item1: 2, Item2: 2, Item3: 3, Item4: 2, Item5: 2 },
      { ID: 10, Item1: 4, Item2: 4, Item3: 4, Item4: 4, Item5: 4 },
      { ID: 11, Item1: 3, Item2: 3, Item3: 3, Item4: 3, Item5: 3 },
      { ID: 12, Item1: 5, Item2: 5, Item3: 4, Item4: 5, Item5: 5 },
      { ID: 13, Item1: 4, Item2: 4, Item3: 5, Item4: 4, Item5: 4 },
      { ID: 14, Item1: 1, Item2: 2, Item3: 2, Item4: 1, Item5: 2 },
      { ID: 15, Item1: 4, Item2: 4, Item3: 3, Item4: 4, Item5: 4 },
      { ID: 16, Item1: 3, Item2: 3, Item3: 4, Item4: 3, Item5: 3 },
      { ID: 17, Item1: 5, Item2: 5, Item3: 5, Item4: 5, Item5: 5 },
      { ID: 18, Item1: 4, Item2: 4, Item3: 3, Item4: 4, Item5: 4 },
      { ID: 19, Item1: 2, Item2: 3, Item3: 2, Item4: 3, Item5: 2 },
      { ID: 20, Item1: 4, Item2: 4, Item3: 4, Item4: 4, Item5: 4 }
    ]
  },

  reliability: {
    name: 'Reliability Analysis',
    columns: ['ID', 'Q1', 'Q2', 'Q3', 'Q4', 'Q5'],
    data: [
      { ID: 1, Q1: 4, Q2: 4, Q3: 5, Q4: 4, Q5: 4 },
      { ID: 2, Q1: 3, Q2: 3, Q3: 3, Q4: 3, Q5: 3 },
      { ID: 3, Q1: 5, Q2: 5, Q3: 5, Q4: 5, Q5: 5 },
      { ID: 4, Q1: 2, Q2: 2, Q3: 2, Q4: 3, Q5: 2 },
      { ID: 5, Q1: 4, Q2: 4, Q3: 4, Q4: 4, Q5: 4 },
      { ID: 6, Q1: 3, Q2: 3, Q3: 4, Q4: 3, Q5: 3 },
      { ID: 7, Q1: 5, Q2: 5, Q3: 4, Q4: 5, Q5: 5 },
      { ID: 8, Q1: 4, Q2: 4, Q3: 4, Q4: 4, Q5: 4 },
      { ID: 9, Q1: 1, Q2: 2, Q3: 1, Q4: 2, Q5: 1 },
      { ID: 10, Q1: 4, Q2: 4, Q3: 5, Q4: 4, Q5: 4 },
      { ID: 11, Q1: 3, Q2: 3, Q3: 3, Q4: 3, Q5: 3 },
      { ID: 12, Q1: 5, Q2: 5, Q3: 5, Q4: 5, Q5: 5 },
      { ID: 13, Q1: 4, Q2: 3, Q3: 4, Q4: 4, Q5: 4 },
      { ID: 14, Q1: 2, Q2: 2, Q3: 2, Q4: 2, Q5: 2 },
      { ID: 15, Q1: 4, Q2: 4, Q3: 4, Q4: 4, Q5: 4 },
      { ID: 16, Q1: 3, Q2: 3, Q3: 3, Q4: 3, Q5: 3 },
      { ID: 17, Q1: 5, Q2: 5, Q3: 5, Q4: 5, Q5: 5 },
      { ID: 18, Q1: 4, Q2: 4, Q3: 3, Q4: 4, Q5: 4 },
      { ID: 19, Q1: 2, Q2: 2, Q3: 3, Q4: 2, Q5: 2 },
      { ID: 20, Q1: 4, Q2: 4, Q3: 4, Q4: 4, Q5: 4 }
    ]
  }
};

// ---------------------------------------------------------------------------
// GET /api/templates/:type - return sample data as JSON
// ---------------------------------------------------------------------------
app.get('/api/templates/:type', (req, res) => {
  const template = TEMPLATES[req.params.type];
  if (!template) {
    return res.status(404).json({ error: 'Template not found', available: Object.keys(TEMPLATES) });
  }
  res.json(template);
});

// ---------------------------------------------------------------------------
// GET /api/templates/:type/download - return .xlsx file
// ---------------------------------------------------------------------------
app.get('/api/templates/:type/download', (req, res) => {
  const template = TEMPLATES[req.params.type];
  if (!template) {
    return res.status(404).json({ error: 'Template not found', available: Object.keys(TEMPLATES) });
  }

  const ws = XLSX.utils.json_to_sheet(template.data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Disposition', `attachment; filename="${req.params.type}_template.xlsx"`);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buf);
});

// ---------------------------------------------------------------------------
// POST /api/ai/test - test Gemini connection
// ---------------------------------------------------------------------------
app.post('/api/ai/test', async (req, res) => {
  try {
    const { apiKey, model } = req.body;

    if (!apiKey || !model) {
      return res.status(400).json({ error: 'apiKey and model are required' });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Say Connected!' }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 64
        }
      })
    });

    const result = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: result.error?.message || 'API error', details: result });
    }

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.json({ success: true, message: text.trim() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// POST /api/ai/summarize - generate Chapter 4 summary via Gemini
// ---------------------------------------------------------------------------
app.post('/api/ai/summarize', async (req, res) => {
  try {
    const { apiKey, model, data, title, format } = req.body;

    if (!apiKey || !model || !data) {
      return res.status(400).json({ error: 'apiKey, model, and data are required' });
    }

    const formatInstructions = {
      'chapter4': `- เขียน 2-4 ย่อหน้าภาษาไทยเชิงวิชาการ สามารถนำไปใส่ในบทที่ 4 ผลการวิจัยได้ทันที
- เริ่มด้วย "จากตารางที่ X แสดง..."
- ระบุค่าสถิติทุกค่าในวงเล็บ ตามรูปแบบ APA เช่น (M = 3.85, S.D. = 0.72) หรือ (t(28) = 2.45, p < .05)
- ระบุการแปลผล เช่น มีนัยสำคัญทางสถิติ/ไม่มีนัยสำคัญ ที่ระดับ .05
- ย่อหน้าสุดท้ายสรุปภาพรวม`,
      'abstract': `- เขียนสรุปสั้น 1-2 ประโยค เหมาะสำหรับบทคัดย่อ (Abstract)
- ระบุผลลัพธ์หลักและนัยสำคัญทางสถิติ
- กระชับ ได้ใจความครบถ้วน`,
      'table-note': `- เขียน 1-2 ประโยคสั้น ๆ เหมาะวางเป็นหมายเหตุใต้ตาราง (Table Note)
- เริ่มด้วย "หมายเหตุ:" หรือ "Note:"
- ระบุเฉพาะค่า n, ระดับนัยสำคัญ, ความหมายของสัญลักษณ์`,
      'presentation': `- เขียนเป็น bullet points 3-5 ข้อ ภาษาไทย สำหรับสไลด์นำเสนอ
- แต่ละข้อสั้นกระชับ อ่านง่าย
- เน้นผลลัพธ์สำคัญและการแปลผล
- ขึ้นต้นแต่ละข้อด้วย "•"`,
      'explain': `- อธิบายผลการวิเคราะห์เป็นภาษาไทยง่าย ๆ ให้คนทั่วไปเข้าใจ
- ไม่ต้องใช้ศัพท์เทคนิคมาก
- เปรียบเทียบให้เห็นภาพ
- เขียน 2-3 ย่อหน้า`,
    };

    const fmtKey = format || 'chapter4';
    const fmtInst = formatInstructions[fmtKey] || formatInstructions['chapter4'];

    const prompt = `คุณคือผู้เชี่ยวชาญด้านสถิติวิจัยระดับปริญญาโท-เอก

การวิเคราะห์: ${title || 'Statistical Analysis Results'}

ข้อมูลผลการวิเคราะห์:
${typeof data === 'string' ? data : JSON.stringify(data, null, 2)}

รูปแบบการเขียน: ${fmtKey === 'chapter4' ? 'บทที่ 4' : fmtKey === 'abstract' ? 'บทคัดย่อ' : fmtKey === 'table-note' ? 'หมายเหตุใต้ตาราง' : fmtKey === 'presentation' ? 'สไลด์นำเสนอ' : 'อธิบายง่าย'}

คำสั่ง:
${fmtInst}
- ห้ามใช้สัญลักษณ์ markdown เช่น *, **, #, ##
- ห้ามใส่ JSON หรือ code
- เขียนเสมือนเป็นผู้วิจัยเอง ห้ามกล่าวถึง AI
- ใช้ภาษาไทยที่เป็นทางการ`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096
        }
      })
    });

    const result = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: result.error?.message || 'API error', details: result });
    }

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.json({ success: true, summary: text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// POST /api/ai/chat - chat with Gemini
// ---------------------------------------------------------------------------
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { apiKey, model, history } = req.body;

    if (!apiKey || !model || !history || !Array.isArray(history)) {
      return res.status(400).json({ error: 'apiKey, model, and history (array) are required' });
    }

    // Convert history to Gemini format — handle both {text} and {content} field names
    const contents = history
      .filter(msg => (msg.text || msg.content))
      .map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.text || msg.content || '' }]
      }));

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096
        }
      })
    });

    const result = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: result.error?.message || 'API error', details: result });
    }

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.json({ success: true, reply: text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);

  // Try to open browser (only on local machine)
  if (!process.env.PORT) {
    const platform = process.platform;
    const url = `http://localhost:${PORT}`;
    if (platform === 'win32') exec(`start ${url}`);
    else if (platform === 'darwin') exec(`open ${url}`);
    else exec(`xdg-open ${url}`);
  }
});
