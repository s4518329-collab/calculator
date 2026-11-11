# Square Black & Orange Calculator (APEX-90)

A high-contrast, industrial-aesthetic web calculator featuring a geometric **square box chassis**, **black and orange styling**, and **visible tactile buttons**. Built with vanilla **HTML5**, **CSS3 (Grid)**, and **JavaScript**.

---

## 🌟 Key Features

- **Architectural Square Design**:
  - Precision square box container with crisp borders and ambient orange backlighting.
  - Symmetrical 4×5 CSS Grid with strict 1:1 aspect ratio square buttons.
  - High-visibility button outlines and high-contrast typography.
- **Arithmetic Engine**:
  - Addition ($+$), Subtraction ($-$), Multiplication ($\times$), and Division ($\div$).
  - Division-by-zero protection (clean `Error` state).
  - Floating-point precision correction ($0.1 + 0.2 = 0.3$).
  - Chained operations support ($2 + 3 \times 4$).
- **Utility Actions**:
  - `AC`: All Clear reset.
  - `±`: Sign toggle (positive/negative).
  - `%`: Percentage computation.
  - `⌫`: Backspace character deletion.
- **Full Physical Keyboard Support**:
  - Digits `0-9` and `.` (decimal)
  - Operators `+`, `-`, `*`, `/`
  - Compute: `Enter` or `=`
  - Delete: `Backspace`
  - Reset: `Escape`

---

## 📁 Project Structure

```text
calculator/
│
├── index.html       # Clean semantic HTML markup with data attributes
├── style.css        # Square box geometry, CSS Grid, black & orange theme
├── script.js        # Calculator arithmetic logic, state machine, and keyboard bindings
└── README.md        # Documentation
```

---

## 🚀 How to Run

1. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge).
2. Click the visible on-screen buttons or type directly on your physical keyboard.
