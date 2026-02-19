# Quick Testing Guide - Interactive Features

## 🚀 Start the System

### Terminal 1 - Backend:
```bash
cd eldercare-backend
node server.js
```
Backend runs on: http://localhost:5000

### Terminal 2 - Frontend:
```bash
cd eldercare-frontend
npm start
```
Frontend runs on: http://localhost:3000

---

## 🧪 Test Scenarios

### ✅ Test 1: Add Medication and Mark Taken

**Steps:**
1. Login with: `USR-F1` (family user)
2. Navigate to Family Dashboard
3. Find an elder card
4. Click **"+ Add Medication"** button
5. Fill form:
   - Medicine Name: `Aspirin`
   - Dosage: `500mg`
   - Frequency: `Twice daily`
   - Start Date: Today
   - End Date: 7 days from now
6. Click **"Add"**
7. ✅ Medication appears in list
8. Click **"Mark Taken"** button
9. ✅ Button becomes disabled
10. ✅ Green event appears in "Today's Activity"

**Expected Result:**
- Medication added successfully
- Green event card shows in Today's Activity
- Status button disabled after marking

---

### ✅ Test 2: Mark Missed and See Alert

**Steps:**
1. Add a medication (follow Test 1, steps 1-7)
2. Click **"Mark Missed"** button
3. ✅ Red event appears in "Today's Activity"
4. Scroll to top → Check **"Alerts"** section
5. ✅ New alert appears: "Elder missed medicine"

**Expected Result:**
- Red event card in Today's Activity
- Alert automatically generated
- Alert shows in Alerts section with timestamp

---

### ✅ Test 3: Schedule Activity

**Steps:**
1. Login as family/caretaker
2. Find an elder card
3. Click **"+ Schedule Activity"** button
4. Select activity from dropdown (e.g., "Walking")
5. Choose date and time
6. Click **"Schedule"**
7. ✅ Activity appears in "Scheduled Activities" section

**Expected Result:**
- Activity scheduled successfully
- Shows in Scheduled Activities with date/time

---

### ✅ Test 4: Add Appointment

**Steps:**
1. Login as family/caretaker
2. Find an elder card
3. Click **"+ Add Appointment"** button
4. Fill form:
   - Doctor Name: `Dr. Smith`
   - Department: `Cardiology`
   - Hospital: `City Hospital`
   - Appointment Time: Future date/time
5. Click **"Add"**
6. ✅ Appointment appears in "Upcoming Appointments"

**Expected Result:**
- Appointment added successfully
- Shows doctor, department, hospital, and time

---

### ✅ Test 5: Admin - Add User

**Steps:**
1. Login with: `USR-A1` (admin user)
2. Navigate to Admin Dashboard
3. Click **"+ Add User"** button
4. Fill form:
   - User Code: `USR-F3`
   - Role: Select `family`
5. Click **"Add User"**
6. ✅ User appears in users table

**Expected Result:**
- New user created
- Appears in "User Management" table

---

### ✅ Test 6: Admin - Assign Elder to User

**Steps:**
1. Login as admin (USR-A1)
2. Click **"+ Assign Elder"** button
3. Select user from dropdown (e.g., USR-F1)
4. Select elder from dropdown
5. Click **"Assign"**
6. ✅ Success message appears

**Expected Result:**
- Elder assigned to user
- User can now see elder in their dashboard

---

## 🎯 Complete User Journey Test

### Full Workflow:

1. **Admin Setup:**
   - Login as admin (USR-A1)
   - Add new user (USR-F3, family)
   - Assign elder to user
   - Logout

2. **Family User Actions:**
   - Login as family (USR-F3)
   - See assigned elder
   - Add medication (Aspirin, 500mg)
   - Mark as taken → See green event
   - Add another medication (Vitamin D, 1000IU)
   - Mark as missed → See red event + alert
   - Schedule activity (Walking, tomorrow 9 AM)
   - Add appointment (Dr. Smith, Cardiology)
   - Logout

3. **Verify Results:**
   - Login again as USR-F3
   - ✅ Medications still there
   - ✅ Events in Today's Activity
   - ✅ Alert visible
   - ✅ Activity scheduled
   - ✅ Appointment listed

---

## 🔍 What to Check

### After Adding Medication:
- [ ] Medication appears in list
- [ ] Shows medicine name, dosage, frequency
- [ ] "Mark Taken" and "Mark Missed" buttons visible
- [ ] Buttons are enabled

### After Marking Status:
- [ ] Buttons become disabled
- [ ] Event appears in Today's Activity
- [ ] Event is color-coded (green/red)
- [ ] If missed: Alert appears at top

### After Scheduling Activity:
- [ ] Activity appears in Scheduled Activities
- [ ] Shows activity name and time
- [ ] Sorted by date

### After Adding Appointment:
- [ ] Appointment appears in Upcoming Appointments
- [ ] Shows doctor, department, hospital, time
- [ ] Only future appointments shown

### Admin Functions:
- [ ] Can add new users
- [ ] Can assign elders to users
- [ ] Statistics update (user count, elder count)
- [ ] Tables show all data

---

## 🐛 Troubleshooting

### Medication not appearing:
- Check backend console for errors
- Verify elder_code and user_code are correct
- Check database has medications table

### Status button not working:
- Check network tab for API call
- Verify events table exists
- Check backend logs

### Alert not appearing after missed:
- Verify backend logic in eventsController
- Check alerts table exists
- Refresh alerts section

### Form not submitting:
- Check all required fields filled
- Check browser console for errors
- Verify API endpoint is correct

---

## 📊 Expected API Calls

### When adding medication:
```
POST http://localhost:5000/medications
Body: {
  elder_code, medicine_name, dosage, 
  frequency, start_date, end_date, user_code
}
```

### When marking status:
```
POST http://localhost:5000/events
Body: {
  elder_code, event_type: "medicine",
  ref_id, status: "taken"/"missed", notes
}
```

### When scheduling activity:
```
POST http://localhost:5000/activities
Body: {
  elder_code, activity_name, 
  schedule_time, user_code
}
```

### When adding appointment:
```
POST http://localhost:5000/appointments
Body: {
  elder_code, doctor_name, department,
  hospital, appointment_time, user_code
}
```

---

## ✅ Success Indicators

### System is working correctly if:
1. ✅ All forms submit successfully
2. ✅ Data appears immediately after submission
3. ✅ No page refresh needed
4. ✅ Buttons disable after marking status
5. ✅ Alerts auto-generate on missed events
6. ✅ Color coding works (green/red)
7. ✅ Admin can add users and assign elders
8. ✅ All data persists after logout/login

---

## 🎉 Demo Flow

**Perfect demo sequence:**

1. Show login → Enter USR-F1
2. Show Family Dashboard with elder
3. Click "+ Add Medication" → Fill form → Submit
4. Show medication appears
5. Click "Mark Taken" → Show green event
6. Add another medication
7. Click "Mark Missed" → Show red event + alert
8. Click "+ Schedule Activity" → Submit
9. Click "+ Add Appointment" → Submit
10. Show complete elder card with all data
11. Logout → Login as admin
12. Show admin dashboard
13. Add new user
14. Assign elder to user
15. Show statistics

**This demonstrates all interactive features in ~5 minutes!**
