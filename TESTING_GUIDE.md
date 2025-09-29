# Time Slot Management System - Testing Guide

## 🧪 **Testing Checklist**

### **1. Database Setup**
- [ ] Run the SQL migration: `shared-database/supabase-availability-slots-fix.sql`
- [ ] Verify the `get_available_slots_for_date()` function exists
- [ ] Check that all new columns are added to `availability_slots` table

### **2. Admin Interface Testing**

#### **Settings Page Access**
- [ ] Navigate to `/settings` in admin-facing app
- [ ] Verify "Availability Management" tab is visible
- [ ] Check both "Weekly View" and "Table View" toggle buttons work

#### **Weekly Schedule View**
- [ ] Switch to "Weekly View" mode
- [ ] Verify all 7 days are displayed (Sunday - Saturday)
- [ ] Check that clinic hours (9 AM - 6 PM) are clearly indicated
- [ ] Verify empty state shows "No slots configured"

#### **Slot Creation - Individual**
- [ ] Click "Add Slot" button
- [ ] Test Enhanced Slot Modal opens
- [ ] Create a recurring slot (e.g., Monday 9-10 AM, 3 appointments)
- [ ] Verify slot appears in weekly view
- [ ] Test editing the created slot
- [ ] Test toggling slot active/inactive

#### **Slot Creation - Bulk**
- [ ] Click "Bulk Add" button
- [ ] Test Enhanced Bulk Modal opens
- [ ] Select "Standard Weekdays" preset
- [ ] Choose Monday-Friday
- [ ] Create multiple time slots (9-10 AM, 10-11 AM, 2-3 PM)
- [ ] Verify all slots are created correctly

#### **Copy Day Schedule**
- [ ] Configure Monday with 3-4 time slots
- [ ] Use "Copy Monday to Tue-Fri" function
- [ ] Verify Tuesday-Friday now have identical schedules

### **3. Patient Interface Testing**

#### **Appointment Form**
- [ ] Navigate to patient booking form
- [ ] Select today's date (or a future date)
- [ ] Verify time slots appear automatically
- [ ] Check format: "9:00 AM - 10:00 AM (3 spots available)"
- [ ] Select a time slot and verify confirmation appears

#### **Availability Logic**
- [ ] Create a slot with max 2 appointments
- [ ] Book 1 appointment for that slot
- [ ] Verify patient sees "1 spot available"
- [ ] Book 2nd appointment
- [ ] Verify slot no longer appears for new bookings

### **4. Integration Testing**

#### **Admin → Patient Flow**
- [ ] Admin creates new recurring slots
- [ ] Patient immediately sees new slots (no cache issues)
- [ ] Admin disables a slot
- [ ] Verify slot disappears from patient view

#### **Specific Date Overrides**
- [ ] Create recurring Monday 9-10 AM slot
- [ ] Create specific date override for next Monday 9-10 AM (different capacity)
- [ ] Verify patient sees override slot, not recurring slot

#### **Real-time Capacity**
- [ ] Admin sets slot capacity to 3
- [ ] Patient books 1 appointment
- [ ] Admin checks slot shows "1/3 booked"
- [ ] Patient books 2nd appointment
- [ ] Admin sees "2/3 booked"

### **5. Edge Case Testing**

#### **Time Validation**
- [ ] Try creating slot outside clinic hours (before 9 AM)
- [ ] Try creating slot outside clinic hours (after 6 PM)
- [ ] Verify validation prevents invalid times

#### **Overlapping Slots**
- [ ] Create slot 9-10 AM
- [ ] Try creating overlapping slot 9:30-10:30 AM
- [ ] Verify system handles appropriately

#### **Date Logic**
- [ ] Test recurring slots appear on correct days
- [ ] Test specific date slots only appear on target date
- [ ] Test effective_from/effective_until date ranges

### **6. API Testing**

#### **Admin API Endpoints**
```bash
# Test GET all slots
curl http://localhost:3000/api/availability-slots

# Test POST new slot
curl -X POST http://localhost:3000/api/availability-slots \
  -H "Content-Type: application/json" \
  -d '{"day_of_week": 1, "start_time": "09:00", "end_time": "10:00", "max_appointments": 3, "is_available": true, "is_recurring": true}'

# Test PATCH update slot
curl -X PATCH http://localhost:3000/api/availability-slots/[slot-id] \
  -H "Content-Type: application/json" \
  -d '{"max_appointments": 5}'

# Test DELETE slot
curl -X DELETE http://localhost:3000/api/availability-slots/[slot-id]
```

#### **Patient API Endpoints**
```bash
# Test availability for specific date
curl "http://localhost:3001/api/availability?date=2024-01-15"

# Verify response includes time slots with capacity info
```

### **7. Performance Testing**

#### **Load Testing**
- [ ] Create 50+ recurring slots across all days
- [ ] Test admin interface responsiveness
- [ ] Test patient booking form load time
- [ ] Verify database queries are efficient

#### **Concurrent Access**
- [ ] Have multiple admins modify slots simultaneously
- [ ] Have multiple patients book appointments simultaneously
- [ ] Verify no race conditions or data corruption

### **8. User Experience Testing**

#### **Admin UX**
- [ ] Time to create weekly schedule < 5 minutes
- [ ] Bulk operations work intuitively
- [ ] Visual feedback is clear and immediate
- [ ] Error messages are helpful

#### **Patient UX**
- [ ] Time slot selection is intuitive
- [ ] Availability information is clear
- [ ] No confusing or broken states
- [ ] Mobile responsiveness works

## 🐛 **Common Issues to Watch For**

1. **Time Zone Issues**: Ensure all times are handled consistently
2. **Cache Problems**: Admin changes should immediately affect patient view
3. **Capacity Calculation**: Verify appointment counts are accurate
4. **Date Logic**: Recurring vs. specific date precedence
5. **Validation Errors**: Proper error handling for invalid inputs

## ✅ **Success Criteria**

The system passes testing if:
- [ ] Admin can configure weekly schedules in under 5 minutes
- [ ] Patients see accurate, real-time availability
- [ ] No double-booking or capacity violations occur
- [ ] System handles edge cases gracefully
- [ ] Performance remains good with realistic data volumes
- [ ] User experience is intuitive for both admin and patients

## 🚀 **Ready for Production**

Once all tests pass, the system is ready for real-world use with:
- Comprehensive time slot management
- Real-time availability tracking
- Professional user interfaces
- Robust data consistency
- Scalable architecture
