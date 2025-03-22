# WLD-101

Welcome! 🎉

This repository provides a clear and straightforward template demonstrating how to build a Mini App using [World's Mini Apps](https://docs.world.org/mini-apps).

The example Mini App uses **Next.js** and showcases various [commands](https://docs.world.org/mini-apps/quick-start/commands) supported by the MiniKit SDK. Start here to quickly experiment and integrate Worldcoin Mini Apps into your projects.

Let's dive in! 🚀

---

## Dependencies

- **[pnpm](https://pnpm.io/)**: Fast and efficient package manager.
- **[ngrok](https://ngrok.com/)**: Expose your local server publicly for easy testing.
- **[mini-kit-js](https://www.npmjs.com/package/@worldcoin/mini-kit-js)**: JavaScript SDK for World's Mini Apps.
- **[minikit-react](https://www.npmjs.com/package/@worldcoin/minikit-react)**: React bindings for MiniKit SDK.
- **[mini-apps-ui-kit-react](https://www.npmjs.com/package/@worldcoin/mini-apps-ui-kit-react)**: Pre-built UI components for Mini Apps.

---

## 🛠️ Setup

### 1. Clone the repository

```bash
git clone git@github.com:wlding-blocks/wld-mini-apps-101.git
cd wld-mini-apps-101
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure your environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Then fill in the required variables:

#### 🔑 APP_ID

Find your **App ID** in the [Developer Portal](https://developer.worldcoin.org/) (`Configuration > Basic`).

<img width="400" alt="image" src="https://github.com/user-attachments/assets/b1d67769-bce7-46b9-a9e2-1591fb7f33f2" />

#### 🔑 DEV_PORTAL_API_KEY

Generate your **API Key** under the `API Keys` section.  
**Note:** Visible only once—copy it carefully!

<img width="400" alt="image" src="https://github.com/user-attachments/assets/b8b8906a-25e1-411f-8eee-d647fa1e2672" />

#### 🔑 JWT_SECRET

Add a strong, random string as your JWT secret for secure user sessions:

JWT_SECRET=your_secure_random_string_at_least_32_chars_long

This secret is used to:
- Sign and verify JWT tokens for user authentication
- Maintain persistent login sessions across page refreshes
- Securely store user information between visits

**Security Tips:**
- Use a cryptographically strong random string (at least 32 characters)
- Never expose this secret in client-side code
- Consider rotating this secret periodically for enhanced security

Without a properly configured `JWT_SECRET`, the authentication system will not work correctly, and users will need to log in each time they visit your Mini App.

---

## ▶️ Running the Project

Run your Mini App locally:

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📱 Testing on Mobile

To test your Mini App directly on your phone, expose your app publicly using NGROK.

### 🚀 Using NGROK

Install [NGROK](https://ngrok.com/) and run:

```bash
ngrok http http://localhost:3000
```

NGROK provides a publicly accessible URL.

### 🌎 Configuring Your App (Developer Portal)

Go to the [Developer Portal](https://developer.worldcoin.org/) and configure:

- **App URL:** Set it to your NGROK-generated URL.

<img width="400" alt="image" src="https://github.com/user-attachments/assets/4d2c2c1b-cab4-40a7-ad6d-f91d1a77ecc5" />

- **Incognito Actions**: Define an action and use it within `components/Verify/index.tsx`.

---

### 📱 Opening your Mini App in World App

From the [Developer Portal](https://developer.worldcoin.org/), navigate to `Configuration > Basic` and scan the generated QR code.

<img width="350" alt="image" src="https://github.com/user-attachments/assets/6f560f96-3fd8-4611-838f-3af7e337d5ce" />

The World App will automatically launch your Mini App! 🎉

<img width="350" alt="image" src="https://github.com/user-attachments/assets/c2c7b49b-5641-4fd1-abc0-a310b621a4dd" />

---

## 🔗 Useful Links

- [World Documentation](https://docs.world.org/)
- [Developer Portal](https://developer.worldcoin.org/)

---

## 📞 Contact

Questions or feedback? Feel free to reach out!

- **Telegram:** [@miguellalfaro](https://t.me/miguellalfaro)

---

## ℹ️ Notes

This repository is based on the official [minikit-next-template](https://github.com/worldcoin/minikit-next-template). Contributions are welcome—feel free to submit PRs!



# 🌐 World Private Network (WPN) – Project Overview

**World Private Network (WPN)** is a decentralized private VPN experience designed for **digital nomads**, **remote workers**, and **individuals in censored countries** to securely access the internet and work without restrictions.

Unlike public VPN services that are often blocked or surveilled in countries like China or Russia, **WPN uses a private, invite-only model**. Access is granted only through **recommendations**, forming a trusted network of secure connection points invisible to mass surveillance systems.

WPN stands for:

- ✅ **Privacy**: End-to-end encrypted, user-first communication.
- ⚡ **Speed**: Fast and stable private tunnels across the globe.
- 🛡️ **Community**: Access granted only by people you trust.

WPN isn't just a tool—it’s a movement to defend **freedom of information** and **digital independence**.

---

## 📱 App Screens

### 1. 🏠 HomeScreen

- **Purpose**: Introduce the platform and prompt the user to take action.
- **Key Elements**:
  - WPN logo and tagline: _"Access beyond borders"_
  - A dynamic carousel showing WPN’s three pillars: **Privacy**, **Speed**, **Community**
  - A floating call-to-action button: `Connect Now`
  - An invite button (top-right corner) to recommend other users.

---

### 2. 🔐 ConnectionScreen

- **Purpose**: Show the user's VPN access status and enable further actions.
- **States**:
  - ✅ **Active**:
    - Shows a progress bar with time remaining.
    - Displays start and end date of the current VPN session.
    - Includes a deep link button to open the VPN.
  - ❌ **Expired**:
    - A message explains the session has ended.
    - A button allows the user to trigger a (mocked) payment flow.
    - The button has visual feedback for `idle`, `loading`, `success`, and `error`.
  - ⚠️ **Missing Recommendations**:
    - A message tells the user they need more recommendations to proceed.

- **UX Highlights**:
  - Smooth `framer-motion` transitions.
  - Color-coded icons (green for active, red for expired, yellow for warnings).
  - Transitions and animations designed for emotional clarity and trust.

---

### 3. 🤝 RecommendationScreen

- **Purpose**: Allow users to recommend trusted peers into the network.
- **Flow**:
  - Input a wallet address (EVM or `.sol`).
  - Show a confirmation modal before sending.
  - On success, reset the screen and provide feedback.
- **UX Highlights**:
  - Modal slides up with animations.
  - Success state with check icon.
  - Back button in top-left corner to return to Home.

---

## ✨ Core Philosophy

WPN is designed for people who:
- Travel often and need stable VPN access worldwide.
- Live in countries where VPNs are restricted or illegal.
- Want to be part of a trusted, encrypted communication system.

**No accounts. No emails. No central authority. Only privacy and access, through trust.**

---

