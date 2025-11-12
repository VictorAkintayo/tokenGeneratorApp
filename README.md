# Genera8 - Secure Token & Password Generator

A modern, AI-powered web application for generating cryptographically secure tokens, passwords, and secret keys. Built with Next.js, React, and TypeScript, featuring a beautiful UI and advanced security features.

## Features

### Core Generation
- **Token Generation**: Generate alphanumeric or numeric tokens with customizable length (4-16 characters)
- **Password Generation**: Create strong passwords with configurable complexity:
  - Customizable length (8-32 characters)
  - Toggle uppercase, lowercase, numbers, and symbols
  - Custom character sets
  - Real-time strength meter
- **Secret Key Generation**: Generate 256-bit hexadecimal secret keys (64 characters) for API keys and encryption

### AI-Powered Features
- **AI Security Audit**: Get detailed security analysis of generated passwords with:
  - Security score (0-100)
  - Strengths and weaknesses identification
  - Actionable improvement suggestions
  - Use case recommendations (banking, corporate, personal, high-security)
- **AI Configuration Assistant**: Context-aware configuration recommendations based on your use case
- **AI Suggestions**: Intelligent recommendations for password improvements

### Advanced Tools
- **Batch Generator**: Generate multiple tokens/passwords at once
- **Custom Character Sets**: Define your own character set for password generation
- **Pattern Generator**: Generate passwords following specific patterns
- **Expiration Tracking**: Set expiration dates for generated items
- **History Panel**: View and manage previously generated items with local storage
- **Presets Panel**: Save and load favorite configuration settings

### Security & Privacy
- **100% Client-Side**: All generation happens locally using Web Crypto API
- **No Data Transmission**: Nothing is sent to servers - complete privacy
- **Cryptographically Secure**: Uses `crypto.getRandomValues()` for true randomness
- **Local Storage**: History and presets stored locally in your browser

## Technologies Used

- **Next.js 16**: React framework with App Router
- **React 19**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Vercel AI SDK**: AI-powered features
- **Web Crypto API**: Cryptographically secure random number generation
- **Local Storage API**: Client-side data persistence

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/VictorAkintayo/tokenGeneratorApp.git
cd tokenGeneratorApp
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
genera8/
├── app/
│   ├── api/
│   │   └── ai/
│   │       ├── analyze-password/    # AI password analysis endpoint
│   │       └── suggest-config/     # AI configuration suggestions endpoint
│   ├── globals.css                  # Global styles
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Main application page
├── components/
│   ├── ui/                          # Reusable UI components (Radix UI based)
│   ├── ai-context-suggest.tsx       # AI configuration assistant
│   ├── ai-security-audit.tsx        # AI password security audit
│   ├── ai-suggestions.tsx           # AI suggestions component
│   ├── batch-generator.tsx           # Batch generation tool
│   ├── custom-charset.tsx           # Custom character set editor
│   ├── expiration-tracker.tsx       # Expiration date tracker
│   ├── generated-output.tsx         # Generated value display
│   ├── history-panel.tsx            # Generation history
│   ├── pattern-generator.tsx        # Pattern-based generator
│   ├── presets-panel.tsx             # Configuration presets
│   └── strength-meter.tsx            # Password strength indicator
├── hooks/
│   ├── use-mobile.ts                # Mobile detection hook
│   └── use-toast.ts                  # Toast notification hook
├── lib/
│   ├── storage.ts                   # Local storage management
│   └── utils.ts                      # Utility functions
└── public/                           # Static assets
```

## Usage

### Generating Tokens

1. Select the **Token** tab
2. Choose between **Alphanumeric** (0-9, A-Z) or **Numeric** (0-9 only)
3. Adjust the length slider (4-16 characters)
4. Click **Generate**

### Generating Passwords

1. Select the **Password** tab
2. Adjust the length slider (8-32 characters)
3. Toggle character types:
   - Uppercase (A-Z)
   - Lowercase (a-z)
   - Numbers (0-9)
   - Symbols (!@#$%^&*...)
4. Optionally use a custom character set
5. Click **Generate**
6. View the strength meter and AI security audit

### Generating Secret Keys

1. Select the **Secret Key** tab
2. Click **Generate** (always generates a 256-bit hexadecimal key)

### Using AI Features

1. Click **AI Assistant** in the header
2. Use **Configuration Assistant** to get context-aware recommendations
3. For passwords, use **Security Audit** to analyze generated passwords

### Advanced Tools

Access via the **Advanced** button:
- **Batch Generator**: Generate multiple values at once
- **Custom Character Set**: Define custom character sets
- **Pattern Generator**: Generate passwords following patterns
- **Expiration Tracking**: Set expiration dates for items

### History & Presets

- **History**: View all previously generated items
- **Presets**: Save and load your favorite configurations

## API Endpoints

### POST `/api/ai/analyze-password`

Analyzes a password for security vulnerabilities.

**Request Body:**
```json
{
  "password": "string",
  "context": "string (optional)"
}
```

**Response:**
```json
{
  "analysis": {
    "score": 0-100,
    "strengths": ["string"],
    "weaknesses": ["string"],
    "suggestions": ["string"],
    "useCaseRecommendations": {
      "banking": boolean,
      "corporate": boolean,
      "personal": boolean,
      "highSecurity": boolean
    }
  }
}
```

### POST `/api/ai/suggest-config`

Provides AI-powered configuration suggestions based on use case.

**Request Body:**
```json
{
  "useCase": "string",
  "requirements": "string (optional)"
}
```

## Security Considerations

- **Client-Side Only**: All generation happens in the browser - no server-side processing
- **Web Crypto API**: Uses cryptographically secure random number generation
- **No Network Transmission**: Generated values never leave your device
- **Local Storage**: History and presets are stored locally in your browser
- **No Tracking**: No analytics or tracking of generated values

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Any browser with Web Crypto API support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Author

**Victor Akintayo**

- GitHub: [@VictorAkintayo](https://github.com/VictorAkintayo)

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide](https://lucide.dev/)
- AI features powered by [Vercel AI SDK](https://sdk.vercel.ai/)
