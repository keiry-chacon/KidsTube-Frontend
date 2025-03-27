# KidsTube - Parental Control Platform for Children's Content

## Table of Contents
- [Explanation](#explanation)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Frontend](#frontend)
- [Dependencies](#dependencies)
- 
## Description
KidsTube is a web platform that allows parents and guardians to select and manage the audiovisual content their children can view. The application enables:

- Creating playlists with YouTube videos or custom content
- Managing restricted profiles for children with controlled access
- Administering playlists and content securely

**Architecture**:
- Backend: REST services
- Frontend: Client application that consumes the services

## Objectives
1. Develop a web platform for parental control of audiovisual content
2. Allow selection of approved content (YouTube or custom videos)
3. Implement SOA architecture with:
   - Backend: REST services
   - Frontend: Client for service consumption

## Functional Requirements

### 1. Main Account Registration
**User Story**: As a potential user, I want to register to access the platform.

**Acceptance Criteria**:
- Form with mandatory fields (*):
  - Email*
  - Password*
  - Repeat Password
  - Phone Number*
  - PIN (6 digits)*
  - First Name*
  - Last Name*
  - Country
  - Date of Birth*
- Frontend and backend validations
- Age verification (18+)
- Successful error-free registration

### 2. Login
**User Story**: As a registered user, I want to log in to the platform.

**Criteria**:
- Only for main account
- Form with validations
- Clear error messages
- Redirect to home screen

### 3. Home Screen
**Flow**:
1. Main account:
   - Displays avatars of restricted users
   - "Administration" option (requires PIN)
2. Restricted user:
   - Requests specific PIN
   - Shows assigned playlist

### 4. Restricted User Management
**Features**:
- List of existing users
- New user form:
  - Full Name*
  - PIN (6 digits)*
  - Avatar (predefined images)*
- Full CRUD operations (Create, Read, Update, Delete)

### 5. Playlist Management
**Characteristics**:
- List showing video count
- New playlist form:
  - Name*
  - Associated Profiles* (multiple selection)
- Edit and delete operations

### 6. Video Management
**Workflow**:
1. Select playlist
2. View existing videos
3. Add new video:
   - Name*
   - Valid YouTube URL*
   - Description
4. Edit/Delete videos

### 7. Playlist Viewing (Restricted User)
**Experience**:
1. PIN authentication
2. View all assigned playlists
3. Video details per playlist

### 8. Search
**Functionality**:
- Search field in playlist view
- Search by:
  - Video name
  - Description
- Clickable results


## Prerequisites

✔️ **Git**
✔️ **Angular CLI** v19+ (frontend only)

```bash
# Verify installations
node --version
npm --version
mongod --version
git --version
ng version
```

## Installation
Backend
Clone repository:

```bash
git clone https://github.com/your-user/kidstube.git
cd kidstube/kidstube-backend
```
## Install dependencies:

```bash
npm install
```

## Frontend (environment.ts)
```bash
export const environment = {
production: false,
apiUrl: 'http://localhost:3000' // Must match the backend port
};
```
## Execution
Frontend ng serve 4200 http://localhost:4200
```bash
Frontend (package.json)
"dependencies": {
"@angular/core": "^19.1.0",
"@angular/material": "^19.1.5",
"bootstrap": "^5.3.3",
"rxjs": "~7.8.0"
}
```
And finally, the console executes
```bash
ng serve
```
