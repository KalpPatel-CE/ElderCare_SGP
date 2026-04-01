# Demo Credentials for ElderCare System

## Admin Account
- **Email**: admin@mail.com
- **Password**: password
- **Role**: Admin
- **Dashboard**: http://localhost:3000/admin

## Family Account
- **Email**: family@mail.com
- **Password**: password
- **Role**: Family
- **Dashboard**: http://localhost:3000/family
- **City**: Ahmedabad

## Caretaker Accounts

### Caretaker 1 (Original Test Account)
- **Email**: caretaker@mail.com
- **Password**: password
- **Name**: (Check database)
- **City**: Ahmedabad
- **Dashboard**: http://localhost:3000/caretaker

### Caretaker 2 - Meera Shah
- **Email**: meera@care.com
- **Password**: password
- **Code**: CRT-2
- **City**: Surat
- **Specialization**: Dementia Care
- **Experience**: 7 years
- **Rating**: 4.8
- **Dashboard**: http://localhost:3000/caretaker

### Caretaker 3 - Rajesh Mehta
- **Email**: rajesh@care.com
- **Password**: password
- **Code**: CRT-3
- **City**: Vadodara
- **Specialization**: Post-Surgery Care
- **Experience**: 10 years
- **Rating**: 4.9
- **Dashboard**: http://localhost:3000/caretaker

### Caretaker 4 - Priya Joshi
- **Email**: priya@care.com
- **Password**: password
- **Code**: CRT-4
- **City**: Rajkot
- **Specialization**: Elderly Care
- **Experience**: 4 years
- **Rating**: 4.6
- **Dashboard**: http://localhost:3000/caretaker

### Caretaker 5 - Dinesh Patel
- **Email**: dinesh@care.com
- **Password**: password
- **Code**: CRT-5
- **City**: Ahmedabad
- **Specialization**: Palliative Care
- **Experience**: 8 years
- **Rating**: 4.7
- **Dashboard**: http://localhost:3000/caretaker

## Password Hash Used
All accounts use the same bcrypt hash for password "password":
```
$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
```

## How to Use for Demo

1. **Start Backend**: 
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend**: 
   ```bash
   cd frontend
   npm start
   ```

3. **Login**: Go to http://localhost:3000/login

4. **Demo Flow**:
   - Login as **family@mail.com** to create elder profile and request caretaker
   - Login as **admin@mail.com** to assign caretakers to requests
   - Login as any **caretaker** to view assignments and submit care logs

## Notes
- Make sure you've run the `upgrade-schema.sql` to seed the test data
- All caretakers are marked as "available" and "verified"
- Cities covered: Ahmedabad, Surat, Vadodara, Rajkot
