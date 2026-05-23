// ⚠️ LEGAL: Upload API must use UK/EU storage only (e.g. S3 eu-west-2). Never wire US-only buckets.

export type KnowledgeDocStatus = "indexed" | "processing" | "failed";

export type KnowledgeDocument = {
  id: string;
  name: string;
  type: string;
  size: string;
  uploaded: string;
  status: KnowledgeDocStatus;
  usedBy: string[];
};

export const KNOWLEDGE_STATS = {
  documents: 12,
  indexed: 11,
  storageMb: 48,
};

export const KNOWLEDGE_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: "d1",
    name: "Brand voice guide 2026.pdf",
    type: "PDF",
    size: "2.4 MB",
    uploaded: "3d ago",
    status: "indexed",
    usedBy: ["Social Manager", "Content Writer"],
  },
  {
    id: "d2",
    name: "Product catalogue — SME tier.docx",
    type: "DOCX",
    size: "1.1 MB",
    uploaded: "5d ago",
    status: "indexed",
    usedBy: ["Executive Assistant", "Sales Assistant"],
  },
  {
    id: "d3",
    name: "FAQ — customer support.md",
    type: "Markdown",
    size: "84 KB",
    uploaded: "1w ago",
    status: "indexed",
    usedBy: ["Receptionist", "Executive Assistant"],
  },
  {
    id: "d4",
    name: "Invoice terms & payment policy.pdf",
    type: "PDF",
    size: "620 KB",
    uploaded: "2w ago",
    status: "indexed",
    usedBy: ["Admin Assistant"],
  },
  {
    id: "d5",
    name: "Q1 case studies batch.zip",
    type: "ZIP",
    size: "8.2 MB",
    uploaded: "20m ago",
    status: "processing",
    usedBy: [],
  },
  {
    id: "d6",
    name: "Legacy pricing sheet 2023.xlsx",
    type: "XLSX",
    size: "340 KB",
    uploaded: "3w ago",
    status: "failed",
    usedBy: [],
  },
];
