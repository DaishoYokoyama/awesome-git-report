# Awesome Git Report 🚀

AI-powered Git commit analyzer that generates intelligent summaries and reports from your repository history with multi-language support.

## ✨ Features

- 🤖 **AI-Powered Analysis**: Uses Google Gemini AI to analyze commit messages and code changes
- 🌍 **Multi-Language Support**: Generate reports in Japanese (ja), English (en), or Chinese (cn)
- 📅 **Flexible Date Ranges**: Specify custom date ranges for commit analysis
- 🌐 **Timezone Support**: Handle different timezones for accurate date filtering
- 📁 **Multi-Repository**: Analyze any Git repository by specifying the path
- 📊 **Detailed Reports**: Generate comprehensive Markdown reports with:
  - Change overviews
  - Main functional changes
  - Affected files with descriptions
  - Author and date information
- ⚡ **Real-time Progress**: Visual progress indicators during report generation

## 🛠️ Technology Stack

- **TypeScript** - Type-safe development
- **Google Gemini AI** - Advanced commit analysis
- **Commander.js** - CLI interface
- **Zod** - Schema validation
- **Simple Git** - Git operations
- **Date-fns** - Date manipulation and timezone handling

## 📦 Installation

### 🚀 NPX Usage (Recommended)

No installation required! Run directly:

```bash
# Set your API key
export GOOGLE_API_KEY=your_google_gemini_api_key

# Run the tool
npx awesome-git-report --from-date 2024-01-01 --to-date 2024-01-31
```

### 🌐 Global Installation

```bash
# Install globally
npm install -g awesome-git-report

# Set API key and run
export GOOGLE_API_KEY=your_google_gemini_api_key
awesome-git-report --from-date 2024-01-01 --to-date 2024-01-31
```

### 🛠️ Development Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/awesome-git-report.git
cd awesome-git-report
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env file
echo "GOOGLE_API_KEY=your_google_gemini_api_key" > .env
```

## 🔑 Environment Setup

You need to obtain a Google Gemini API key:

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add it to your `.env` file:
```env
GOOGLE_API_KEY=your_api_key_here
```

## 🚀 Usage

### NPX Usage (Recommended)

```bash
# Basic usage
export GOOGLE_API_KEY=your_api_key_here
npx awesome-git-report --from-date 2024-01-01 --to-date 2024-01-31

# Advanced usage with all options
npx awesome-git-report \
  --from-date 2024-01-01 \
  --to-date 2024-01-31 \
  --language en \
  --timezone "America/New_York" \
  --repository "/path/to/your/repo" \
  --output "monthly-report.md"
```

### Global Installation Usage

```bash
# After global installation
awesome-git-report --from-date 2024-01-01 --to-date 2024-01-31
```

### Development Usage

```bash
# For development/testing
npm run dev -- --from-date 2024-01-01 --to-date 2024-01-31

# Build and run
npm run build
npm start -- --from-date 2024-01-01 --to-date 2024-01-31
```

## 📖 CLI Options

| Option         | Short | Description                 | Default           | Required |
| -------------- | ----- | --------------------------- | ----------------- | -------- |
| `--from-date`  | `-f`  | Start date (YYYY-MM-DD)     | -                 | Yes      |
| `--to-date`    | `-t`  | End date (YYYY-MM-DD)       | -                 | Yes      |
| `--language`   | `-l`  | Report language (ja/en/cn)  | `ja`              | No       |
| `--timezone`   | `-z`  | Timezone (e.g., Asia/Tokyo) | System timezone   | No       |
| `--repository` | `-r`  | Git repository path         | Current directory | No       |
| `--output`     | `-o`  | Output file path            | `report.md`       | No       |
| `--help`       | `-h`  | Show help                   | -                 | No       |

## 📊 Sample Output

The generated report includes:

```markdown
# Git Commit Report

** FromDate - ToDate **: 2024-01-01T00:00:00.000+09:00 - 2024-01-31T23:59:59.999+09:00
** Timezone **: Asia/Tokyo
** Total Commit Count **: 15
** Repository **: /path/to/repo

## Commits

### abc123def - Added user authentication feature

** Commit Message **: Implement JWT-based authentication system
** Author **: John Doe
** Date **: 2024-01-15T10:30:00+09:00

#### Change overview
Implemented a complete JWT-based authentication system with login/logout functionality and protected routes.

#### Main changes
- Added JWT token generation and validation
- Created login/logout API endpoints
- Implemented middleware for protected routes
- Added user session management

#### Affected files
- src/auth/jwt.ts
- src/routes/auth.ts
- src/middleware/auth.ts
- src/models/user.ts

---
```

## 🌍 Language Support

### Japanese (ja)
```bash
npm start -- -f 2024-01-01 -t 2024-01-31 -l ja
```

### English (en)
```bash
npm start -- -f 2024-01-01 -t 2024-01-31 -l en
```

### Chinese (cn)
```bash
npm start -- -f 2024-01-01 -t 2024-01-31 -l cn
```

## 🚨 Error Handling

The tool provides clear error messages for common issues:

- **Invalid dates**: Ensures proper date format and logical date ranges
- **Invalid timezone**: Validates timezone strings
- **Repository not found**: Checks if the specified path is a valid Git repository
- **Git errors**: Handles various Git command failures gracefully
- **API errors**: Manages Google Gemini API connection issues

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for powerful natural language processing
- [Commander.js](https://github.com/tj/commander.js/) for excellent CLI framework
- [Simple Git](https://github.com/steveukx/git-js) for seamless Git integration

## 🐛 Troubleshooting

### Common Issues

**"Not a git repository" error:**
```bash
# Make sure you're in a Git repository or specify the path
npm start -- -f 2024-01-01 -t 2024-01-31 -r /path/to/git/repo
```

**API key errors:**
```bash
# Verify your .env file contains the correct API key
cat .env
```

**Date format errors:**
```bash
# Use ISO 8601 date format (YYYY-MM-DD)
npm start -- -f 2024-01-01 -t 2024-01-31
```
