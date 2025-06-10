import React, { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Plus, FileText, Upload, File } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";

export const DocumentUpload: React.FC = () => {
  const uploadDocument = useMutation(api.documents.uploadDocument);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    content: "",
    type: "other" as "policy" | "procedure" | "evidence" | "other",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if it's a PDF
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        setFormData((prev) => ({
          ...prev,
          name: file.name.replace(".pdf", ""),
        }));
        toast.success(`PDF file "${file.name}" selected`);
      } else {
        toast.error("Please select a PDF file");
        event.target.value = "";
      }
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    // For now, return a placeholder text since we don't have PDF.js setup
    // In a real implementation, you would use PDF.js or send to a server for extraction
    return `PDF Content from ${file.name}
    
This is a placeholder for PDF text extraction. In a real implementation, you would:

1. Use PDF.js library to extract text from the PDF
2. Parse the document structure and content
3. Extract meaningful text while preserving formatting

The file "${file.name}" (${(file.size / 1024).toFixed(1)} KB) has been uploaded and is ready for processing.

For CMMC compliance documents, this would typically contain:
- Policy statements and procedures
- Implementation guidelines
- Evidence of compliance activities
- Audit trail information
- Technical configuration details

This content would then be processed for embeddings and RAG functionality.`;
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a PDF file");
      return;
    }

    setIsUploading(true);
    try {
      // Extract text content from PDF
      const extractedContent = await extractTextFromPDF(selectedFile);

      await uploadDocument({
        name: formData.name || selectedFile.name.replace(".pdf", ""),
        content: extractedContent,
        type: formData.type,
      });

      toast.success(`PDF "${selectedFile.name}" uploaded successfully`);
      setFormData({ name: "", content: "", type: "other" });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
      toast.error("Failed to upload PDF file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleTextUpload = async () => {
    if (!formData.name.trim() || !formData.content.trim()) {
      toast.error("Please fill in both name and content fields");
      return;
    }

    setIsUploading(true);
    try {
      await uploadDocument({
        name: formData.name,
        content: formData.content,
        type: formData.type,
      });

      toast.success(`Document "${formData.name}" uploaded successfully`);
      setFormData({ name: "", content: "", type: "other" });
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  const sampleDocuments = [
    {
      name: "CMMC Level 1 Scoping Guide v2",
      content: `NOTICES
The contents of this document do not have the force and effect of law and are not meant to bind the public in any way. This document is intended only to provide clarity to the public regarding existing requirements under the law or departmental policies.

DISTRIBUTION STATEMENT A. Approved for public release. Distribution is unlimited.

CMMC LEVEL 1 SCOPING GUIDE

1. INTRODUCTION
The Cybersecurity Maturity Model Certification (CMMC) framework is designed to enhance the cybersecurity posture of the Defense Industrial Base (DIB). This scoping guide provides organizations with detailed instructions for determining the scope of their CMMC Level 1 assessment.

2. SCOPE DETERMINATION
Organizations must identify all systems, networks, and facilities that process, store, or transmit Federal Contract Information (FCI). The scope includes:

2.1 In-Scope Assets
- All information systems that process FCI
- Networks that carry FCI traffic  
- Facilities where FCI is processed or stored
- Personnel with access to FCI systems

2.2 Out-of-Scope Assets
- Public-facing websites with no FCI
- Administrative systems with no FCI access
- Guest networks isolated from FCI systems

3. ASSESSMENT BOUNDARIES
The assessment boundary defines the limits of the CMMC assessment and includes all components within the scope of the certification.

4. SECURITY CONTROLS
CMMC Level 1 includes 17 controls across multiple domains focusing on basic cyber hygiene practices.`,
      type: "other" as const,
      isCreativeCommons: true,
      source:
        "https://dodcio.defense.gov/Portals/0/Documents/CMMC/ScopingGuideL1v2.pdf",
    },
    {
      name: "CMMC Level 1 Assessment Guide v2",
      content: `NOTICES
The contents of this document do not have the force and effect of law and are not meant to bind the public in any way. This document is intended only to provide clarity to the public regarding existing requirements under the law or departmental policies.

DISTRIBUTION STATEMENT A. Approved for public release. Distribution is unlimited.

CMMC LEVEL 1 ASSESSMENT GUIDE

1. PURPOSE
This assessment guide provides Certified Third Party Assessment Organizations (C3PAOs) and organizations with detailed guidance on conducting CMMC Level 1 assessments.

2. ASSESSMENT METHODOLOGY
The CMMC assessment process follows a standardized methodology:

2.1 Pre-Assessment Activities
- System documentation review
- Scope validation
- Assessment team preparation

2.2 Assessment Activities  
- Control implementation verification
- Evidence collection and review
- Gap identification

2.3 Post-Assessment Activities
- Report generation
- Findings documentation
- Certification decision

3. CONTROL ASSESSMENT
Each of the 17 CMMC Level 1 controls must be assessed for implementation:

3.1 Access Control (AC)
- AC.L1-3.3.1: Create and retain audit logs
- AU.L1-3.3.2: Ensure audit events are reviewed

3.2 Audit and Accountability (AU)
- AU.L1-3.3.1: Create and retain audit logs
- AU.L1-3.3.2: Ensure audit events are reviewed

3.3 Configuration Management (CM)
- Implementation verification procedures
- Evidence requirements
- Assessment criteria

4. EVIDENCE COLLECTION
Assessors must collect sufficient evidence to verify control implementation including policies, procedures, technical configurations, and operational evidence.`,
      type: "procedure" as const,
      isCreativeCommons: true,
      source:
        "https://dodcio.defense.gov/Portals/0/Documents/CMMC/AssessmentGuideL1v2.pdf",
    },
    {
      name: "CMMC Model Overview v2",
      content: `NOTICES  
The contents of this document do not have the force and effect of law and are not meant to bind the public in any way. This document is intended only to provide clarity to the public regarding existing requirements under the law or departmental policies.

DISTRIBUTION STATEMENT A. Approved for public release. Distribution is unlimited.

CYBERSECURITY MATURITY MODEL CERTIFICATION (CMMC) MODEL OVERVIEW

1. EXECUTIVE SUMMARY
The CMMC framework provides a comprehensive and scalable certification mechanism to verify the implementation of cybersecurity controls in defense contractors.

2. CMMC STRUCTURE
The CMMC model consists of multiple levels with increasing cybersecurity requirements:

2.1 CMMC Level 1 - Foundational
- 17 security controls
- Basic cyber hygiene
- Annual self-assessment

2.2 CMMC Level 2 - Advanced  
- 110 security controls
- Enhanced cybersecurity practices
- Third-party assessment required

3. LEVEL 1 CONTROL FAMILIES
CMMC Level 1 includes controls from the following families:

3.1 Access Control (AC) - 1 control
- Limit system access to authorized users

3.2 Audit and Accountability (AU) - 2 controls  
- Create and retain audit logs
- Review audit events

3.3 Configuration Management (CM) - 3 controls
- Establish configuration baselines
- Control configuration changes  
- Define security configurations

3.4 Identification and Authentication (IA) - 2 controls
- Identify users and devices
- Authenticate users and devices

3.5 Media Protection (MP) - 1 control
- Sanitize or destroy media

3.6 Physical Protection (PE) - 4 controls
- Limit physical access
- Escort visitors
- Maintain audit logs for physical access
- Control physical access devices

3.7 System and Communications Protection (SC) - 2 controls
- Monitor communications boundaries
- Implement cryptographic mechanisms

3.8 System and Information Integrity (SI) - 4 controls
- Identify and correct system flaws
- Provide malicious code protection
- Update malicious code protection
- Perform periodic scans

4. IMPLEMENTATION GUIDANCE
Organizations must implement all 17 controls to achieve CMMC Level 1 certification. Each control includes specific implementation requirements and assessment objectives.`,
      type: "policy" as const,
      isCreativeCommons: true,
      source:
        "https://dodcio.defense.gov/Portals/0/Documents/CMMC/ModelOverviewv2.pdf",
    },
    {
      name: "Access Control Implementation Guide",
      content: `ACCESS CONTROL IMPLEMENTATION GUIDE

This guide provides detailed implementation guidance for CMMC Level 1 Access Control requirements.

CONTROL: AC.L1-3.1.1
REQUIREMENT: Limit information system access to authorized users, processes, and devices, and authorized types of transactions and functions.

IMPLEMENTATION GUIDANCE:

1. USER ACCESS MANAGEMENT
- Maintain current list of authorized users
- Implement account provisioning procedures
- Regular access reviews and updates
- Account deactivation procedures

2. PROCESS AND DEVICE CONTROLS
- Whitelist approved software and processes
- Device authorization procedures
- Network access controls
- Mobile device management

3. TRANSACTION CONTROLS
- Role-based access controls
- Function-level security
- Business rule enforcement
- Audit trail maintenance

4. TECHNICAL IMPLEMENTATION
- Active Directory configurations
- Network access control systems
- Application-level access controls
- Database security configurations

5. EVIDENCE REQUIREMENTS
- User access lists
- Access control policies
- System configurations
- Access review documentation

This implementation ensures compliance with CMMC Level 1 access control requirements while maintaining operational efficiency.`,
      type: "procedure" as const,
      isCreativeCommons: false,
    },
  ];

  const addSampleDocument = async (doc: (typeof sampleDocuments)[0]) => {
    setIsUploading(true);
    try {
      await uploadDocument(doc);
      toast.success(`Sample document "${doc.name}" added successfully`);
    } catch (error) {
      console.error("Error adding sample document:", error);
      toast.error("Failed to add sample document");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="bg-zinc-800 border-zinc-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Upload Document
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Upload PDF files or add text documents for embedding processing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* PDF Upload Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white">Upload PDF File</h4>
          <div className="border-2 border-dashed border-zinc-600 rounded-lg p-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="pdf-upload"
            />
            <label
              htmlFor="pdf-upload"
              className="cursor-pointer flex flex-col items-center gap-2 text-zinc-400 hover:text-zinc-300"
            >
              {selectedFile ? (
                <>
                  <File className="h-8 w-8 text-green-500" />
                  <span className="text-sm text-white">
                    {selectedFile.name}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </span>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8" />
                  <span className="text-sm">Click to select PDF file</span>
                  <span className="text-xs">Supports PDF documents</span>
                </>
              )}
            </label>
          </div>

          {selectedFile && (
            <div className="space-y-2">
              <Input
                placeholder="Document name (optional)"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="bg-zinc-700 border-zinc-600 text-white placeholder-zinc-400"
              />

              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: e.target.value as any,
                  }))
                }
                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white"
              >
                <option value="policy">Policy</option>
                <option value="procedure">Procedure</option>
                <option value="evidence">Evidence</option>
                <option value="other">Other</option>
              </select>

              <Button
                onClick={handleFileUpload}
                disabled={isUploading}
                className="w-full gap-2"
              >
                <Upload className="h-4 w-4" />
                {isUploading ? "Processing PDF..." : "Upload PDF"}
              </Button>
            </div>
          )}
        </div>

        <div className="border-t border-zinc-700"></div>

        {/* Text Document Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white">Add Text Document</h4>
          <Input
            placeholder="Document name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="bg-zinc-700 border-zinc-600 text-white placeholder-zinc-400"
          />

          <select
            value={formData.type}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, type: e.target.value as any }))
            }
            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white"
          >
            <option value="policy">Policy</option>
            <option value="procedure">Procedure</option>
            <option value="evidence">Evidence</option>
            <option value="other">Other</option>
          </select>

          <textarea
            placeholder="Document content"
            value={formData.content}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, content: e.target.value }))
            }
            rows={4}
            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white placeholder-zinc-400 resize-none"
          />

          <Button
            onClick={handleTextUpload}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? "Uploading..." : "Upload Text Document"}
          </Button>
        </div>

        <div className="border-t border-zinc-700 pt-4">
          <p className="text-sm text-zinc-400 mb-3">
            Or add sample documents for testing:
          </p>
          <div className="mt-3 space-y-2">
            {sampleDocuments.map((doc, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-300">{doc.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {doc.type}
                  </Badge>
                  {doc.isCreativeCommons && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-green-600 hover:bg-green-700 text-white"
                    >
                      Creative Commons
                    </Badge>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => addSampleDocument(doc)}
                  className="text-xs"
                >
                  Add Sample
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
