# CMMC Compass - Community CMMC Level 1 Platform

<div align="center">
  <img src="https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/vmby46tevqgow4x9b48u" alt="Tekimax LLC Logo" width="100" height="100">
  <br>
  <strong>By Tekimax LLC</strong>
</div>

[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Open Source](https://img.shields.io/badge/Open%20Source-Community%20Driven-brightgreen.svg)]()
[![Self-Hosted](https://img.shields.io/badge/Deployment-Self--Hosted-blue.svg)]()

> A free, open-source CMMC Level 1 compliance platform built by small business owners who went through their own CMMC journey. Self-host everything locally for complete data control.

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
- 💰 **Expensive Solutions**: Most CMMC tools cost $10,000+ annually - too much for small businesses
- 🏢 **Enterprise-Focused**: Existing tools designed for large corporations, not small teams
- ☁️ **Cloud Dependency**: Compliance data stored on vendor servers, creating new security risks
- 🔒 **Vendor Lock-in**: Proprietary platforms that trap your compliance data
- 📚 **Complex Setup**: Solutions requiring extensive IT teams to implement

### Our Solution Philosophy
- 🎯 **Small Business First**: Built for teams of 5-50 people, not Fortune 500 companies
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

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18+) 
- **pnpm** package manager
- **Ollama** (for local AI)
- **Convex** (self-hosted recommended)

### 1. Clone & Install
```bash
git clone https://github.com/tekimax/cmmc-level-1-compliance.git
cd cmmc-level-1-compliance
pnpm install
```

### 2. Set Up Convex (Self-Hosted Recommended)
```bash
# For self-hosting (recommended)
# Follow Convex self-hosting documentation
# Your data stays on your infrastructure

# Alternative: Convex Cloud (optional)
npx convex dev
```

### 3. Install Ollama (Local AI)
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Start Ollama service
ollama serve

# Download recommended models
ollama pull llama3.2:latest
ollama pull mxbai-embed-large:latest
```

### 4. Start the Platform
```bash
pnpm run dev
```

The platform will be available at `http://localhost:5175`

## 📋 CMMC Level 1 Coverage

### Complete Implementation of All 17 Controls

| Domain | Controls | Implementation |
|--------|----------|----------------|
| **Access Control (AC)** | 3 controls | ✅ Complete |
| **Awareness and Training (AT)** | 1 control | ✅ Complete |
| **Audit and Accountability (AU)** | 2 controls | ✅ Complete |
| **Configuration Management (CM)** | 2 controls | ✅ Complete |
| **Identification and Authentication (IA)** | 2 controls | ✅ Complete |
| **System and Communications Protection (SC)** | 7 controls | ✅ Complete |

### Each Control Includes:
- 📝 **Implementation Guidance** - Step-by-step instructions
- 🎯 **Assessment Objectives** - What assessors will evaluate
- 📊 **Progress Tracking** - Real-time implementation status
- 📁 **Evidence Management** - Upload and organize compliance documents
- 🤖 **AI Assistance** - Control-specific guidance and recommendations
- ✅ **Verification Checklists** - Ensure nothing is missed

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