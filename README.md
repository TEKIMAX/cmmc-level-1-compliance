# CMMC Compass - Community CMMC Level 1


<div align="center">
  <img src="src/public/cmmc.png" alt="CMMC Compass Platform Preview" width="800" style="border-radius: 8px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3); margin: 20px 0;">
</div>

[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
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
- **Convex** account ([Sign up free](https://dashboard.convex.dev/))
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

We are **Tekimax LLC**, a small technology business that went through CMMC Level 1 compliance ourselves. When we couldn't find affordable, privacy-focused compliance tools designed for small businesses, we built our own. Instead of keeping it proprietary, we open-sourced it under the MIT license so the entire small business community can benefit.

### Our Story
- 🏢 **Small Business Focus**: We understand the unique challenges small businesses face with compliance
- 💰 **No Hidden Costs**: Built during our own compliance journey - not a product we sell
- 🤝 **Community Driven**: Open source contributions welcome from fellow small business owners
- 🔒 **Privacy First**: Self-hosting ensures your compliance data never leaves your premises

## 🎯 WHAT This Platform Provides

**Complete CMMC Level 1 Compliance Management - 100% Self-Hosted**

### Core Features
- ✅ **All 17 CMMC Level 1 Controls** - Complete coverage across 6 NIST domains
- 📊 **Real-Time Dashboards** - Track implementation progress and compliance status
- 🤖 **Local AI Assistant** - CMMC guidance using local Ollama models (no data sent to cloud)
- 📁 **Document Management** - Upload policies, procedures, and evidence with local processing
- 🔍 **RAG Search** - Semantic search through your compliance documents
- 📝 **Audit Logging** - Comprehensive tracking for compliance evidence
- 👥 **Assignment Management** - Track control ownership and due dates

### Technical Stack
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Convex (self-hosted recommended, cloud optional)
- **AI Processing**: Ollama (100% local, privacy-preserving)
- **Database**: Convex with vector storage for document embeddings
- **Authentication**: Convex Auth (can run completely offline)

### Self-Hosting Benefits
- 🔐 **Complete Data Control** - Your compliance data never leaves your infrastructure
- 💸 **No Monthly Fees** - One-time setup, no ongoing subscription costs
- 🚫 **No Vendor Lock-in** - Open source means you control your destiny
- 🏠 **On-Premises Deployment** - Perfect for security-conscious organizations
- ⚡ **Local AI Processing** - Fast responses without internet dependency

## 💡 WHY We Built This

**The Small Business CMMC Challenge**

When we started our CMMC Level 1 journey, we discovered:

### The Problems We Faced
- 💰 **Expensive Solutions**: Most CMMC tools are too expensive for small businesses
- 🏢 **Enterprise-Focused**: Existing tools designed for large corporations, not small teams
- ☁️ **Cloud Dependency**: Compliance data stored on vendor servers, creating new security risks
- 🔒 **Vendor Lock-in**: Proprietary platforms that trap your compliance data
- 📚 **Complex Setup**: Solutions requiring extensive IT teams to implement

### Our Solution Philosophy
- 🎯 **Small Business First**: Built for small teams, not enterprise corporations
- 💻 **Self-Hosted by Default**: Your compliance data stays on your infrastructure
- 🆓 **Completely Free**: MIT licensed - use, modify, and distribute without restrictions
- 🛠️ **Community Driven**: Improvements come from real small businesses facing real challenges
- 📖 **Transparent**: Open source means you can audit every line of code

### Why Open Source?
We chose the MIT license because:
- 🤝 **Community Over Profit**: We want to help other small businesses, not sell them services
- 🔍 **Full Transparency**: You can see exactly how your compliance data is handled
- 🛡️ **Security Through Openness**: Community review makes the platform more secure
- 🚀 **Continuous Improvement**: Features driven by real user needs, not sales targets

## 🏗️ Architecture & Deployment

### Recommended Self-Hosted Setup
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Your Server   │    │   Your Server   │    │   Your Server   │
│                 │    │                 │    │                 │
│  React Frontend │◄──►│ Convex Backend  │◄──►│  Ollama AI      │
│                 │    │                 │    │                 │
│  Port: 5175     │    │  Self-Hosted    │    │  Port: 11434    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Benefits of Self-Hosting
- 🔐 **Data Sovereignty**: Your compliance data never leaves your premises
- ⚡ **Performance**: Local processing is faster than cloud round-trips
- 💰 **Cost Control**: No monthly subscription fees
- 🛡️ **Security**: Reduced attack surface with no external dependencies
- 📊 **Compliance**: Easier to demonstrate data protection to assessors

## 🤖 AI Features (100% Local)

### Privacy-Preserving AI with Ollama
- 🏠 **Local Processing**: All AI computation happens on your hardware
- 🚫 **No Data Sharing**: Your compliance questions never leave your network
- ⚡ **Fast Responses**: Local models provide instant feedback
- 🔒 **Offline Capable**: Works without internet connectivity

### RAG (Retrieval Augmented Generation)
- 📄 **Document Understanding**: Upload policies, procedures, and evidence
- 🧠 **Context-Aware Responses**: AI references your specific organizational documents
- 🔍 **Semantic Search**: Find relevant compliance information instantly
- 📚 **Knowledge Base**: Build your organization's compliance knowledge repository

## 🤝 Contributing

**We Welcome Community Contributions!**

As a community-driven project, we encourage contributions from fellow small business owners:

### How to Contribute
- 🐛 **Report Issues**: Found a bug? Let us know!
- 💡 **Feature Requests**: Suggest improvements based on your compliance experience
- 🔧 **Code Contributions**: Submit pull requests with enhancements
- 📚 **Documentation**: Help improve setup guides and user documentation
- 💬 **Community Support**: Help other small businesses in discussions

### Contribution Guidelines
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## ⚖️ License & Disclaimer

### MIT License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**What this means:**
- ✅ **Free to use** for commercial and personal projects
- ✅ **Free to modify** and create derivative works
- ✅ **Free to distribute** your modified versions
- ✅ **No warranty** - use at your own risk

### Important Disclaimers

⚠️ **Not Professional Services**: This is a free, open-source tool built during our own CMMC journey. It is not professional consulting services.

⚠️ **CMMC Updates & Compliance**: Some access controls and configurations may not reflect the latest CMMC requirements. Always follow official CMMC updates and guidance to ensure your configurations remain compliant. The platform should be regularly updated based on evolving CMMC standards.

⚠️ **Use at Your Own Risk**: While we've built this based on our compliance experience, every organization is different. Consult with certified CMMC professionals for official guidance.

⚠️ **Community Tool**: This platform represents our shared experience and community knowledge, not official CMMC guidance.

⚠️ **Self-Hosted Recommended**: For maximum security and compliance, we recommend self-hosting all components locally.

## 🙋‍♂️ Support & Community

### Getting Help
- 📖 **Documentation**: Comprehensive guides in the `/docs` section
- 🐛 **Issues**: Report bugs on GitHub Issues
- 💬 **Discussions**: Community support on GitHub Discussions
- 📧 **Contact**: info@tekimax.com for urgent issues

### Community
- 🌟 **Star the repo** if this helps your small business
- 🍴 **Fork and contribute** improvements
- 📢 **Share your success** stories with CMMC compliance
- 🤝 **Help other small businesses** in the community

---

**Built with ❤️ by small business owners, for small business owners.**

*Tekimax LLC - Empowering small businesses through open-source compliance tools.* 