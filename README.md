# CMMC Compass - Community CMMC Level 1

## Quick Navigation
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Prerequisites](#prerequisites)
- [About Convex Open Source](#about-convex-open-source)
- [License & Disclaimer](#-license--disclaimer)
- [Support](#-support)

<div align="center">
  <img src="src/public/cmmc.png" alt="CMMC Compass Platform Preview" width="800" style="border-radius: 8px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3); margin: 20px 0;">
</div>

[![Apache 2.0 License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Release](https://img.shields.io/github/v/release/TEKIMAX/cmmc-level-1-compliance?include_prereleases&style=flat-square)](https://github.com/TEKIMAX/cmmc-level-1-compliance/releases)
[![Version](https://img.shields.io/github/package-json/v/TEKIMAX/cmmc-level-1-compliance?style=flat-square)](https://github.com/TEKIMAX/cmmc-level-1-compliance)
[![Open Source](https://img.shields.io/badge/Open%20Source-Community%20Driven-brightgreen.svg)]()
[![Self-Hosted](https://img.shields.io/badge/Deployment-Self--Hosted-blue.svg)]()

# CMMC Level 1 Compliance Manager

A comprehensive platform for managing CMMC (Cybersecurity Maturity Model Certification) Level 1 compliance requirements with AI-powered assistance and automated document processing.

## ✨ Features

- **🔐 CMMC Level 1 Controls Management**: Complete implementation tracking for all 17 CMMC Level 1 controls
- **🤖 AI-Powered Assistance**: Built-in AI chat for compliance guidance using Ollama or OpenAI
- **📋 Real-time Compliance Dashboard**: Visual overview of implementation status and progress
- **📄 Document Management**: Upload, process, and search compliance documents with AI embeddings
- **🎯 Automated Assessment**: Generate compliance reports and track control implementation
- **🔍 Smart Document Search**: AI-powered document search using vector embeddings
- **📊 Audit Logging**: Complete audit trail for compliance activities
- **🎨 Modern UI**: Clean, professional interface built with React and Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or later)
- **Bun** package manager
- **Convex (Open Source/Self-Hosted Recommended):**
  - [Convex Self-Hosting Guide](https://docs.convex.dev/self-hosting)
  - [Convex Open Source GitHub](https://github.com/get-convex/convex-backend)
- **Ollama** (optional, for local AI models)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TEKIMAX/cmmc-level-1-compliance.git
   cd cmmc-level-1-compliance
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up Convex**
   ```bash
   bunx convex init
   bunx convex deploy
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

5. **Start development servers**
   ```bash
   bun run dev
   ```

## 🔧 Environment Variables

### Required Local Variables (`.env.local`)

```bash
# Convex Configuration (Required)
CONVEX_DEPLOY_KEY=project:your_team:your_project|your_deploy_key_here
CONVEX_DEPLOYMENT=dev:your-deployment-name
VITE_CONVEX_URL=https://your-deployment-name.convex.cloud

# Auth Configuration
CONVEX_SITE_URL=http://localhost:5176

# Ollama Configuration (for local AI)
OLLAMA_API_PORT=3002
OLLAMA_BASE_URL=http://localhost:11434
```

### Convex Deployment Variables

These should be set in your Convex dashboard or via CLI:

```bash
# OpenAI Integration (Optional - for enhanced AI features)
CONVEX_OPENAI_API_KEY=sk-your_openai_api_key_here
OPENAI_API_TOKEN=sk-your_openai_api_key_here

# OpenAI Proxy (if using)
CONVEX_OPENAI_BASE_URL=https://your-proxy-url.convex.site/openai-proxy

# Email Integration (Optional - for notifications)
CONVEX_RESEND_API_KEY=your_resend_api_key_here
RESEND_BASE_URL=https://your-proxy-url.convex.site/resend-proxy

# JWT Configuration (for auth)
JWKS={"keys":[...]}
JWT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...-----END PRIVATE KEY-----

# Site URL
SITE_URL=http://localhost:5173
```

### Setting Convex Environment Variables

You can set environment variables in your Convex deployment using:

```bash
# Via CLI
bunx convex env set VARIABLE_NAME "value"

# Via Dashboard
# Go to https://dashboard.convex.dev/ → Your Project → Settings → Environment Variables
```

## 🤖 AI Configuration

### Option 1: Ollama (Local AI - Recommended)

1. **Install Ollama**
   ```bash
   # macOS
   brew install ollama
   
   # Linux
   curl -fsSL https://ollama.ai/install.sh | sh
   ```

2. **Pull required models**
   ```bash
   # For text generation
   ollama pull llama3.2:latest
   
   # For embeddings
   ollama pull mxbai-embed-large:latest
   ```

3. **Start Ollama server**
   ```bash
   ollama serve
   ```

### Option 2: OpenAI Integration

1. **Get OpenAI API Key**
   - Visit [OpenAI API](https://platform.openai.com/api-keys)
   - Create a new API key

2. **Set environment variable**
   ```bash
   bunx convex env set CONVEX_OPENAI_API_KEY "sk-your_api_key_here"
   ```

## 📋 CMMC Level 1 Controls Included

The platform includes all 17 CMMC Level 1 controls:

- **AC.L1-3.1.1**: Access Control Policy
- **AC.L1-3.1.2**: Account Management  
- **AC.L1-3.1.3**: External Connections
- **AC.L1-3.1.4**: Information Flow
- **AC.L1-3.1.5**: Separation of Duties
- **AC.L1-3.1.6**: Least Privilege
- **AC.L1-3.1.7**: Unsuccessful Access
- **AC.L1-3.1.8**: Privacy/Security Notices
- **AC.L1-3.1.9**: Previous Logon Notification
- **AC.L1-3.1.10**: Concurrent Session Control
- **AC.L1-3.1.11**: Session Lock
- **AC.L1-3.1.12**: Session Termination
- **AC.L1-3.1.13**: Supervision and Review
- **AC.L1-3.1.14**: Permitted Actions
- **AC.L1-3.1.15**: Privileged Functions
- **AC.L1-3.1.16**: Security Attributes
- **AC.L1-3.1.17**: Remote Access

## 🤝 WHO We Are

**Built by Small Business Owners, For Small Business Owners**

We are **Tekimax LLC**, a small technology business that went through CMMC Level 1 compliance ourselves. When we couldn't find affordable, privacy-focused compliance tools designed for small businesses, we built our own. Instead of keeping it proprietary, we open-sourced it under the Apache 2.0 license so the entire small business community can benefit.

### Our Story
- 🏢 **Small Business Focus**: We understand the unique challenges small businesses face with compliance
- 💰 **No Hidden Costs**: Built during our own compliance journey - not a product we sell
- 🤝 **Community Driven**: Open source contributions welcome from fellow small business owners
- 🔒 **Privacy First**: Self-hosting ensures your compliance data never leaves your premises

## 🎯 WHAT This Platform Provides

**Complete CMMC Level 1 Compliance Management - 100% Self-Hosted**

### Core Features
- 📊 **Real-time Dashboard**: Track implementation progress across all 17 controls
- 🤖 **AI Assistant**: Get contextual guidance for each control using local or cloud AI
- 📁 **Document Management**: Upload, organize, and search compliance documents
- ✅ **Implementation Tracking**: Mark controls as Not Started → In Progress → Implemented → Verified
- 📋 **Audit Logs**: Maintain complete records for assessor review
- 🔍 **Smart Search**: Find relevant information across all your compliance documents

### Why We Built This
- 🆓 **Completely Free**: Apache 2.0 licensed - use, modify, and distribute without restrictions
- 🏠 **Self-Hosted**: Your data stays on your infrastructure - no cloud dependencies
- 🔒 **Privacy-First**: No telemetry, no tracking, no data collection
- 🛡️ **Security Through Openness**: Community review makes the platform more secure
- 🚀 **Continuous Improvement**: Features driven by real user needs, not sales targets

We chose the Apache 2.0 license because:
- ✅ **Maximum Freedom**: Use commercially without restrictions
- ✅ **Patent Protection**: Includes explicit patent grants
- ✅ **Attribution**: Simple requirements that respect contributors
- ✅ **Enterprise Friendly**: Compatible with most corporate policies

## 🏗️ Architecture & Deployment

### Self-Hosting Options
1. **Convex Self-Hosted** (Recommended)
   - Complete data sovereignty
   - Enterprise-grade security
   - Full feature compatibility

2. **Convex Cloud** (Alternative)
   - Faster setup for development
   - Still maintains data privacy
   - Easy migration to self-hosted later

### Technology Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Convex (self-hostable)
- **AI**: Ollama (local) or OpenAI (cloud)
- **Database**: Convex (built-in)
- **Authentication**: Convex Auth

## 🤝 Contributing

We welcome contributions from the small business community! Here's how you can help:

### Ways to Contribute
- 🐛 **Bug Reports**: Found an issue? Let us know!
- 💡 **Feature Requests**: Suggest improvements based on your compliance experience
- 📖 **Documentation**: Help improve setup guides and user documentation
- 🔧 **Code Contributions**: Submit pull requests with enhancements
- 🗣️ **Community Support**: Help other small businesses in discussions

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License & Disclaimer

### Apache 2.0 License
This project is licensed under the Apache License, Version 2.0 - see the [LICENSE](LICENSE) file for details.

### Disclaimer
**Apache 2.0 License**: This software is provided "as is" without warranty of any kind. Use at your own risk. We built this during our own CMMC journey and share it freely with the community.

**Not Legal Advice**: This platform is a tool to help organize your compliance efforts. It does not constitute legal or compliance advice. Always consult with qualified CMMC assessors and legal professionals for your specific situation.

## 🆘 Support

- 📖 **Documentation**: Check our comprehensive guides above
- 💬 **Community**: Join discussions in GitHub Issues
- 🐛 **Bug Reports**: Use GitHub Issues for technical problems
- 💡 **Feature Requests**: Suggest improvements via GitHub Issues

## About Convex Open Source

CMMC Compass is built to run on [Convex](https://www.convex.dev/), a modern open source backend platform. For privacy, compliance, and full control, we recommend self-hosting Convex using their open source backend:

- [Self-Hosting Documentation](https://docs.convex.dev/self-hosting)
- [Convex Open Source GitHub](https://github.com/get-convex/convex-backend)

Convex is released under the FSL Apache 2.0 License and is actively maintained by the Convex team and community. For more details, see the [Convex Open Source page](https://www.convex.dev/open-source).

---

**Built with ❤️ by small business owners, for small business owners.**

*"We've been through the CMMC journey ourselves. This tool represents everything we wish we had when we started."* 