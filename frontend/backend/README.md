# Vital-X Backend - Firebase Integration

## Overview
This backend uses Firebase for authentication and data storage. All user data is stored in Firestore, and authentication is handled by Firebase Authentication.

## Firebase Configuration
- **Project ID**: vital-x-4f9fd
- **Firebase Console**: https://console.firebase.google.com/project/vital-x-4f9fd

## Services

### 1. Authentication Service (`services/auth-service.js`)
Handles all authentication operations:
- **signUp(email, password, userData)** - Create new user account
- **signIn(email, password)** - Sign in existing user
- **signInWithGoogle()** - Sign in with Google OAuth
- **signOut()** - Sign out current user
- **getCurrentUser()** - Get current authenticated user
- **checkAuth()** - Check if user is authenticated
- **resetPassword(email)** - Send password reset email

### 2. User Service (`services/user-service.js`)
Manages user profile and health data:
- **saveHealthDetails(userId, healthData)** - Save user health information
- **getUserProfile(userId)** - Get user profile data
- **updateProfile(userId, profileData)** - Update user profile
- **calculateBMI(height, weight)** - Calculate BMI
- **saveHealthTracking(userId, healthData)** - Save health tracking data
- **getHealthHistory(userId, limit)** - Get health tracking history

### 3. UI Helpers (`utils/ui-helpers.js`)
Common UI utilities:
- **showSuccess(message)** - Show success notification
- **showError(message)** - Show error notification
- **showInfo(message)** - Show info notification
- **validateEmail(email)** - Validate email format
- **validatePassword(password)** - Validate password strength
- **handleFirebaseError(error)** - Convert Firebase errors to user-friendly messages
- **setButtonLoading(button, loading, loadingText)** - Set button loading state
- **formatDate(date)** - Format date for display

## Firestore Database Structure

### Users Collection (`users`)
```javascript
{
  uid: string,
  email: string,
  firstName: string,
  lastName: string,
  displayName: string,
  photoURL: string (optional),
  createdAt: timestamp,
  updatedAt: timestamp,
  profileComplete: boolean,
  
  // Health Details
  healthDetails: {
    age: number,
    height: number (cm),
    weight: number (kg),
    gender: string,
    bmi: number,
    smokingHabit: string,
    alcoholConsumption: string,
    sleepQuality: string,
    medicalCondition: string,
    
    // For female users
    menstruation: {
      cycleLength: number,
      periodDuration: number,
      painLevel: string,
      flowType: string,
      irregularPeriods: boolean
    }
  },
  
  // Additional profile fields
  phone: string (optional),
  address: string (optional),
  bloodType: string (optional),
  allergies: string (optional),
  medications: string (optional),
  surgeries: string (optional),
  familyHistory: string (optional)
}
```

### Health Tracking Collection (`healthTracking`)
```javascript
{
  userId: string,
  timestamp: timestamp,
  // Additional tracking data fields
}
```

## User Flow

### 1. Sign Up Flow
1. User fills signup form (`frontend/auth/signup.html`)
2. `AuthService.signUp()` creates Firebase Auth user
3. User document created in Firestore with basic info
4. User redirected to health details page

### 2. Health Details Flow
1. User fills health details form (`frontend/auth/health-details.html`)
2. `UserService.saveHealthDetails()` saves data to Firestore
3. User profile marked as complete
4. User redirected to dashboard

### 3. Profile Display Flow
1. User navigates to profile page (`frontend/dashboard/pages/profile/profile.html`)
2. `UserService.getUserProfile()` fetches data from Firestore
3. Profile data displayed on page
4. User can edit various sections

## Firebase Security Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Health tracking collection
    match /healthTracking/{trackingId} {
      allow read, write: if request.auth != null && 
                           resource.data.userId == request.auth.uid;
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Setup Instructions

### 1. Enable Authentication Methods
1. Go to Firebase Console > Authentication > Sign-in method
2. Enable Email/Password
3. Enable Google (optional)

### 2. Create Firestore Database
1. Go to Firebase Console > Firestore Database
2. Create database in production mode
3. Apply security rules from above

### 3. Enable Storage (Optional)
1. Go to Firebase Console > Storage
2. Get started
3. Apply security rules from above

## Testing

### Test User Flow
1. Sign up with email/password
2. Fill health details form
3. Navigate to profile page
4. Verify all data is displayed correctly
5. Edit profile information
6. Verify updates are saved

## Error Handling
All services return objects with `{ success: boolean, data/error: any }` format.
UI Helpers automatically convert Firebase errors to user-friendly messages.

## Next Steps
- Implement health tracking features
- Add more detailed health metrics
- Implement data visualization
- Add export/import functionality
- Implement notification system
