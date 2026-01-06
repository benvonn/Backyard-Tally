# BackyardTally (BYT)

BackyardTally (BYT) is an offline-first scoring application designed for cornhole. Built with simplicity and usability in mind, BYT enables players to track game scores effortlessly using intuitive touchscreen gestures—no internet connection required.

## Features

- Gesture-based scoring  
  - One-finger tap to add or subtract 1 point  
  - Two-finger tap to add or subtract 3 points  

- Real-time dual-team scoreboard with clear, responsive layout optimized for outdoor visibility

- Automatic game history tracking, including date, final scores, and match duration

- Persistent player statistics such as wins, losses, and scoring trends

- Fully offline functionality using browser localStorage—no accounts, ads, or network permissions

- Mobile-optimized interface built for tablets and smartphones, supporting natural one- or two-handed interaction

## Technology

- Frontend framework: React 19 with TypeScript  
- Styling: @emotion/react, @emotion/styled, and react-bootstrap for responsive, accessible UI components  
- Routing: React Router v6  
- Persistence: localStorage  
- Testing: React Testing Library and Jest DOM  
- Build system: Create React App (react-scripts)  

Note: Although Tailwind CSS appears in devDependencies, the production UI is implemented using Emotion and Bootstrap.

## Usage

Open the app in a modern mobile browser. For the best experience, add it to your home screen to launch like a native app. Start a game and use taps to adjust scores—BYT handles the rest automatically.

All data remains on your device and is never transmitted externally.

## Development

To run locally:

```bash
git clone https://github.com/bytrevamped/backyardtally.git
cd backyardtally
npm install
npm start
