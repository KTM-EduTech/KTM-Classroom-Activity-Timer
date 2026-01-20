## How the Timer Actually Works (Technical Explanation)

This timer is **not** using `setTimeout` recursively or `setInterval` with 1000 ms intervals (which would drift significantly over time). Instead, it uses a more accurate approach:

### Core Technique: Target Timestamp + Frequent Polling

1. When you press **Go**:
   - Calculate `endTime = Date.now() + (selectedSeconds × 1000)`
   - This is the exact moment (in milliseconds since 1970) when the timer should finish.

2. Every ~30 ms:
   - `setInterval(updateTimer, 30)`
   - Compute `remaining = endTime - Date.now()`
   - If `remaining ≤ 0` → finish
   - Otherwise display rounded-up seconds: `Math.ceil(remaining / 1000)`

3. Why 30 ms instead of 1000 ms?
   - The display updates very smoothly (no noticeable 1-second jumps)
   - Final second is much more precise (finishes within ~30 ms of real time)
   - Still very lightweight — modern browsers easily handle 33 fps intervals

4. Pause / Resume logic (the tricky part):
   - When pausing: just stop the interval, keep `endTime` unchanged
   - When resuming:
     ```js
     endTime = Date.now() + (current minutes × 60 + current seconds) × 1000
