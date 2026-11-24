# ❄️ Beryl - FiveM Syndicate Community & Roster Portal

เว็บไซต์คอมมูนิตี้และระบบสารบบสมาชิก (Member Roster Directory) สไตล์ FiveM / GTA V Roleplay พัฒนาสำหรับแก๊ง BERYL อย่างประณีตระดับพรีเมียม

---

## ✨ ไฮไลท์และฟังก์ชันเด่น (Key Features)

1. **Winter & Cyber Frost Aesthetic**:
   - ธีมสีดำ Deep Black (`#0a0a0a`), บรรยากาศหิมะโปรยปราย (Snow Particle Canvas) แบบเรียลไทม์
   - เอฟเฟกต์ Glassmorphism แบบโปร่งใส เบลอเนียนตา (`backdrop-blur-xl`)
   - ไฟนีออนเรืองแสงตามระดับยศ (Gold Amber สำหรับ Founders, Ruby Crimson สำหรับ Leaders, Silver Metallic สำหรับ Members)
   - แอนิเมชันพิมพ์ตัวอักษรอัตโนมัติ (Typewriter Effect) บริเวณ Hero Section

2. **ระบบสารบบสมาชิกแบบสมบูรณ์ (Complete Roster System)**:
   - รวบรวมข้อมูลสมาชิกครบทั้ง 5 แก๊งพันธมิตร:
     - **VEGA** (แก๊งหลัก - 83 สมาชิก, 6 ผู้ก่อตั้ง, 20 แกนนำ)
     - **PampamxSlumsick** (DEKRAP - 32 สมาชิก, 4 ผู้ก่อตั้ง, 9 แกนนำ)
     - **REDZONE** (พันธมิตร - 365 สมาชิก, 10 ผู้ก่อตั้ง, 20 แกนนำ)
     - **Tawan & Slumzick** (พี่น้องร่วมสาบาน - 62 สมาชิก, 4 ผู้ก่อตั้ง, 16 แกนนำ)
     - **PEENOO** (พันธมิตร - 365 สมาชิก, 10 ผู้ก่อตั้ง, 20 แกนนำ)
   - ค้นหารายชื่อได้แบบเรียลไทม์ (Instant Live Search) ทันทีที่พิมพ์
   - ระบบแท็บตัวกรอง: `ALL`, `FOUNDERS`, `LEADERS`, `MEMBERS`
   - แถบนำทางด่วนตามตัวอักษร A-Z (Alphabet Index Quick Jump)
   - ป๊อปอัปดูข้อมูล Operator Dossier (รูปโปรไฟล์ขนาดใหญ่, ยศ, สถานะ, ลิงก์ตรงไปยัง Facebook ส่วนตัว)

3. **วิดเจ็ตเครื่องเล่นเพลงลอยได้ (Persistent Floating Music Player)**:
   - เพลง *"Is There Someone Else? - The Weeknd"*
   - เล่นต่อเนื่องไม่มีสะดุด (Seamless SPA Routing) เปลี่ยนหน้าไปดูแก๊งไหน เพลงก็ไม่หยุดเล่น
   - ย่อเป็น Floating Pill แสดงคลื่นเสียง EQ เคลื่อนไหว หรือขยายเป็นเครื่องเล่นเต็มรูปแบบพร้อมตัวปรับระดับเสียง (Volume Slider) และแถบเวลา (Seekable Scrubber)

4. **Zero-Dependency & 100% Standalone**:
   - ใช้งานได้ทันที ไม่ต้องรัน `npm install` หรือตั้งค่า build tool ให้ยุ่งยาก
   - ข้อมูลและรูปภาพสำคัญถูกเก็บไว้ในโปรเจกต์ สามารถเปิดไฟล์ `index.html` ตรงๆ หรือรันผ่าน Local Server ได้ทันที

---

## 🚀 วิธีเปิดใช้งานบนเครื่อง (How to Run Locally)

### วิธีที่ 1: ดับเบิลคลิกเปิดไฟล์ทันที
- เข้าไปที่โฟลเดอร์ `winterfell-vega-web`
- ดับเบิลคลิกที่ไฟล์ `index.html` เพื่อเปิดผ่าน Google Chrome, Edge หรือเบราว์เซอร์ใดก็ได้

### วิธีที่ 2: รันผ่าน Local Web Server (แนะนำเพื่อประสิทธิภาพเสียงและฟอนต์สูงสุด)
เปิด Terminal หรือ PowerShell ในโฟลเดอร์นี้ แล้วพิมพ์:
```bash
python server.py
```
ระบบจะเปิดเบราว์เซอร์ไปที่ `http://localhost:8000` ให้อัตโนมัติทันที

---

## 📁 โครงสร้างไฟล์ในโปรเจกต์ (Project Structure)

```text
winterfell-vega-web/
├── index.html          # โครงสร้างหน้าเว็บหลัก Responsive Desktop & Mobile
├── style.css           # สไตล์เอฟเฟกต์หิมะ, แสงนีออน, Glassmorphism, คลื่นเสียง EQ
├── app.js             # ระบบควบคุม Snow Canvas, เครื่องเล่นเพลง, ค้นหาสมาชิก, Modal
├── data.js            # ฐานข้อมูลสมาชิก, ผู้ก่อตั้ง, รูปภาพ, ลิงก์ Facebook ครบทุกแก๊ง
├── server.py          # สคริปต์รัน Local HTTP Server สำหรับการทดสอบ
├── assets/
│   ├── images/
│   │   ├── vega-logo.png    # โลโก้ตราสัญลักษณ์ Winterfell Vega
│   │   ├── bg.png           # ภาพพื้นหลังบรรยากาศ
│   │   └── the-weeknd.jpg   # ภาพหน้าปกเพลง Is There Someone Else?
│   └── audio/
│       └── is-there-someone-else.mp3  # ไฟล์เสียงเพลงประกอบคุณภาพสูง
└── README.md          # คู่มือการใช้งาน
```

---

## 🌐 วิธีนำขึ้นโฮสติ้งออนไลน์ฟรี (Deployment Guide)

คุณสามารถนำเว็บไซต์นี้ขึ้นออนไลน์ให้คนอื่นเข้าชมได้ฟรี 100% ภายใน 1 นาที:

### 1. Vercel / Netlify
- ลากโฟลเดอร์ `winterfell-vega-web` ไปวางบนหน้า Dashboard ของ [Netlify Drop](https://app.netlify.com/drop) หรือสร้าง Repo บน GitHub แล้วเชื่อมกับ Vercel ได้ทันที ไม่ต้องตั้งค่า Build Command ใดๆ

### 2. GitHub Pages
1. สร้าง New Repository บน GitHub
2. อัปโหลดไฟล์ทั้งหมดในโฟลเดอร์นี้ขึ้นไป
3. ไปที่ **Settings** > **Pages** > เลือก Source เป็น `main` branch แล้วกด **Save**
4. เว็บไซต์จะออนไลน์พร้อมใช้งานทันทีผ่าน `https://<username>.github.io/<repo-name>/`

### 3. Cloudflare Pages
- อัปโหลดไฟล์ผ่าน Direct Upload หรือเชื่อมต่อกับ GitHub ฟรี ไม่มีจำกัด Bandwidth

---

## 🛠️ วิธีแก้ไขหรือเพิ่มรายชื่อสมาชิก (How to Edit Members)

ข้อมูลสมาชิกทั้งหมดถูกจัดเก็บไว้อย่างเป็นระเบียบในไฟล์ `data.js`:
- หากต้องการเพิ่มสมาชิกใหม่ ให้เปิด `data.js` แล้วเพิ่ม Object ในส่วน `members` หรือ `founders`:
```javascript
{
  "firstname": "ชื่อสมาชิก",
  "lastname": "",
  "imageurl": "ลิงก์รูปภาพ",
  "role": "Member", // หรือ "Founder", "Leader"
  "sociallinks": {
    "facebook": "https://www.facebook.com/username"
  }
}
```
บันทึกไฟล์แล้วรีเฟรชหน้าเว็บ ข้อมูลจะอัปเดตและสามารถค้นหาได้ทันที!
