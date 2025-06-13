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

The platform includes all **17 official CMMC Level 1 controls** as defined in the CMMC Self-Assessment Guide v2.0:

### Access Control (AC) - 4 controls
- **AC.L1-3.1.1**: Authorized Access Control
- **AC.L1-3.1.2**: Transaction & Function Control
- **AC.L1-3.1.20**: External Connections
- **AC.L1-3.1.22**: Control Public Information

### Identification & Authentication (IA) - 2 controls
- **IA.L1-3.5.1**: Identification
- **IA.L1-3.5.2**: Authentication

### Media Protection (MP) - 1 control
- **MP.L1-3.8.3**: Media Disposal

### Physical Protection (PE) - 4 controls
- **PE.L1-3.10.1**: Limit Physical Access
- **PE.L1-3.10.3**: Escort Visitors
- **PE.L1-3.10.4**: Physical Access Logs
- **PE.L1-3.10.5**: Manage Physical Access

### System & Communications Protection (SC) - 2 controls
- **SC.L1-3.13.1**: Boundary Protection
- **SC.L1-3.13.5**: Public-Access System Separation

### System & Information Integrity (SI) - 4 controls
- **SI.L1-3.14.1**: Flaw Remediation
- **SI.L1-3.14.2**: Malicious Code Protection
- **SI.L1-3.14.4**: Update Malicious Code Protection
- **SI.L1-3.14.5**: System & File Scanning

> **Note**: These controls are based on the official CMMC Self-Assessment Guide Level 1 v2.0 and represent the complete baseline requirements for CMMC Level 1 certification.


## 🤝 WHO We Are

**Built by Small Business Owners, For Small Business Owners**

We are **Tekimax LLC**, a small technology business that went through CMMC Level 1 compliance ourselves. When we couldn't find affordable, privacy-focused compliance tools designed for small businesses, we built our own. Instead of keeping it proprietary, we open-sourced it under the Apache 2.0 license so the entire small business community can benefit.

### Our Story
- 🏢 **Small Business Focus**: We understand the unique challenges small businesses face with compliance
- 💰 **No Hidden Costs**: Built during our own compliance journey - not a product we sell
- 🤝 **Community Driven**: Open source contributions welcome from fellow small business owners
- 🔒 **Privacy First**: Self-hosting ensures your compliance data never leaves your premises

## 🎯 WHAT This Platform Provides

**Complete CMMC Level 1 Compliance Management**

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
- 🛡️ **Security Through Openness**: Community review makes the platform more secure
- 🚀 **Continuous Improvement**: Features driven by real user needs, not sales targets
- 🌉 **Bridge the Gap**: Our hope is this open source project becomes a bridge between small businesses and security professionals, DoD, and Cyber AB to collaborate and close the 0-to-1 friction and frustration that SMBs face in cybersecurity compliance

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

## 🗺️ Roadmap & TODOs

## 🛠️ **Immediate TODOs (Contributors Welcome!)**

### 🎯 **Priority**
- [ ] **Enhanced AI chat capabilities** - Context-aware responses for each control
- [ ] **Document template library** - Pre-built policy and procedure templates
- [ ] **Export/import functionality** - Backup and restore user data
- [ ] **Multi-language support** - Internationalization for broader accessibility

### 📚 **Learning & Education Focus**
- [ ] **Interactive control tutorials** - Hands-on learning experiences
- [ ] **Glossary and definitions** - Built-in cybersecurity terminology guide
- [ ] **Practice scenarios** - Simulated security situations for learning

### 🤝 **Community Features**
- [ ] **Discussion forums** - Community-driven Q&A and support
- [ ] **User-contributed content** - Allow community to share templates and guides
- [ ] **Success stories section** - Share implementation victories

## 🎓 **TEKIMAX's Teaching Mission**

> *"AI should empower through education, not intimidate through complexity ."*

Every feature we build prioritizes:
- **Learning over compliance checking** - Understanding why, not just what
- **Empowerment through knowledge** - Building cybersecurity expertise
- **Community-driven education** - Learning from peers and experts
- **Practical application** - Bridging theory to real-world implementation

### 🌟 **How to Contribute to Our Teaching Mission**

1. **Educational Content Creation**
   - Create visual guides for complex concepts
   - Develop interactive learning experiences

2. **Community Building**
   - Help other small businesses in discussions
   - Share your implementation experiences
   - Mentor newcomers to cybersecurity

3. **Feature Development**
   - Focus on features that teach, not just track
   - Build tools that explain concepts clearly
   - Create engaging learning experiences

4. **Documentation Improvements**
   - Write clear, beginner-friendly guides
   - Add examples and real-world scenarios
   - Improve accessibility for non-technical users

---

**Built with ❤️ by small business owners, for small business owners.**

*"We've been through the CMMC journey ourselves. This tool represents everything we wish we had when we started."* 