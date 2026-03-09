# Content integration — quizzes and learning

Your **source content** lives in:

**`/Users/crystallion22/Desktop/Bread App/Bread/Content/`**

This doc explains what each file is for and how to get that content into the Bread app.

---

## Source files (Desktop Content folder)

| File | Use in app |
|------|------------|
| **400 Question Bank copy.pdf** | Quiz questions (M&I 400). Convert to JSON for the quiz engine. |
| **M&I 400 2025 copy.pdf** | Same — question bank; merge or pick one as canonical. |
| **IBIG-04-01-Core-Concepts copy.pdf** | Learning module: Core Concepts. |
| **IBIG-04-02-Accounting-3-Statements copy.pdf** | Learning module: Accounting / 3 statements. |
| **IBIG-04-03-More-Advanced-Accounting copy.pdf** | Learning module: Advanced accounting. |
| **IBIG-04-04-Equity-Value-Enterprise-Value-Metrics-Multiples copy.pdf** | Learning module: Valuation (EV, multiples). |
| **IBIG-04-05-Valuation-DCF-Analysis copy.pdf** | Learning module: DCF valuation. |
| **IBIG-04-06-MA-Deals-Merger-Models copy.pdf** | Learning module: M&A / merger models. |
| **IBIG-04-07-Leveraged-Buyouts-LBO-Models copy.pdf** | Learning module: LBO. |

---

## Where converted content goes in the app

- **Quiz questions** → `src/data/` or `src/data/quizzes/`  
  - One JSON file per topic (e.g. `quiz-accounting.json`).  
  - Schema: array of objects with `id`, `format`, `topic`, `question`, `correctAnswer`, optional `options`, `mistake`.  
  - Example: `src/data/quiz-accounting-sample.json`.

- **Learning modules** → `src/data/learning/`  
  - One JSON per module (e.g. `accounting-3-statements.json`).  
  - Schema: `LearningModule` in `src/types/learning.ts` — `id`, `slug`, `title`, `sections[]` (each with `id`, `title`, `body`, optional `keyPoints`), `quizTopic`, `order`.  
  - Index: `src/data/learning/modules-index.json` lists all modules and maps them to `quizTopic`.

- **Topic mapping** → `src/data/quiz-topics.json`  
  - Links quiz topics to learning modules and to which question file to load.

---

## How to convert

### Option 1 — Manual (good for small batches)

1. **Questions:** From the 400 Question Bank (or M&I 400 2025), copy Q&A into entries that match the quiz schema. Start with the accounting section; one question per object with `id`, `format: "flash_q"`, `topic`, `question`, `correctAnswer`. Save as `src/data/quiz-accounting.json` (or add to `quiz-accounting-sample.json`).
2. **Learning:** From each IBIG PDF, copy section headings and body text into a `LearningModule` JSON. Use `src/data/learning/accounting-3-statements.json` as the template; duplicate and rename for each IBIG doc. Update `modules-index.json` if you add new modules.

### Option 2 — PDF text extraction, then edit

1. Install a PDF-to-text tool (e.g. `pdftotext` from Poppler, or a Python script with `PyPDF2` / `pdfplumber`).
2. Export each PDF to text. Clean up formatting (headings, bullets).
3. For **questions:** parse into Q&A pairs (e.g. "Q: ... A: ...") and map into the quiz JSON schema.
4. For **learning:** split by headings into `LearningSection` objects; paste `body` and optional `keyPoints`.

### Option 3 — AI-assisted

1. Use an AI or Cursor with the PDF content (e.g. paste extracted text or use a PDF-reading tool).
2. Prompt: “Convert this into a JSON array of quiz questions with id, format: 'flash_q', topic, question, correctAnswer” or “Convert this into a LearningModule JSON with sections (id, title, body, keyPoints).”
3. Save output into the paths above.

---

## App usage

- **Quiz engine** loads questions from the JSON file(s) referenced in `quiz-topics.json` (e.g. `questionFile: "quiz-accounting.json"`). Use `topic` to filter by accounting, valuation, etc., and to support “learn this topic then take the quiz.”
- **Learning UI** (when you build it) can list modules from `modules-index.json` and render each module’s `sections` from the corresponding JSON in `src/data/learning/`.

---

## Checklist

- [ ] Copy or convert **400 Question Bank** / **M&I 400 2025** into at least one quiz JSON (e.g. `quiz-accounting.json`) in `src/data/`.
- [ ] Update `src/data/quiz-topics.json` so `questionFile` points to your quiz file(s).
- [ ] For each IBIG PDF, create or fill a matching JSON in `src/data/learning/` and keep `modules-index.json` in sync.
- [ ] Wire the quiz engine to use `quiz-topics.json` + the question files, and the learning flow to use `modules-index.json` + learning JSONs.
