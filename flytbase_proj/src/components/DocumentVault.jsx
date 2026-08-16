import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { 
  FileText, 
  Download, 
  Upload, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  FileCheck, 
  HardDrive, 
  FileCode,
  CheckCircle2,
  Lock,
  X
} from 'lucide-react';

export default function DocumentVault({ project }) {
  const { addDocument, viewMode } = useProject();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  
  // Upload form state
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('SOW');
  const [docVisible, setDocVisible] = useState(true);

  const docs = (project?.documents || []).filter(doc => {
    if (viewMode === 'customer') return doc.customerVisible;
    return true;
  });

  const handleUpload = (e) => {
    e.preventDefault();
    if (!docName.trim()) return;

    const newDoc = {
      id: `doc-${Date.now()}`,
      name: docName.endsWith('.pdf') ? docName : `${docName}.pdf`,
      type: docType,
      size: `${(Math.random() * 4 + 1).toFixed(1)} MB`,
      uploadedAt: new Date().toISOString().split('T')[0],
      customerVisible: docVisible,
      url: '#'
    };

    addDocument(project.id, newDoc);
    setDocName('');
    setIsUploadOpen(false);
  };

  const getDocTypeIcon = (type) => {
    switch (type) {
      case 'FAA Clearance':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'Architecture':
        return <FileCode className="w-5 h-5 text-cyan-400" />;
      case 'Financials':
        return <Lock className="w-5 h-5 text-amber-400" />;
      default:
        return <FileCheck className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Project Document Vault & Compliance Repository</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {docs.length} Verified Files
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {viewMode === 'customer'
              ? 'Official project charter, flight certifications, and network architecture deliverables.'
              : 'Secure repository managing client SOWs, FAA waivers, and internal costing records.'}
          </p>
        </div>

        {viewMode === 'internal' && (
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-red-600/25 transition-all self-start sm:self-auto"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Document</span>
          </button>
        )}
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="glass-panel rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-all flex items-start justify-between gap-3 group"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:border-red-500/40 transition-colors">
                {getDocTypeIcon(doc.type)}
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800">
                    {doc.type}
                  </span>
                  {viewMode === 'internal' && (
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded flex items-center gap-0.5 ${
                      doc.customerVisible 
                        ? 'bg-blue-950/60 text-blue-300 border border-blue-800/40' 
                        : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                    }`}>
                      {doc.customerVisible ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                      {doc.customerVisible ? 'Customer Portal' : 'Internal Eyes'}
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                  {doc.name}
                </h4>

                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span>{doc.size}</span>
                  <span>•</span>
                  <span>Uploaded: {doc.uploadedAt}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setPreviewDoc(doc)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Preview Document"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => alert(`Downloading ${doc.name} (Simulated Demo)`)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Preview Document */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel-glow rounded-2xl w-full max-w-xl p-6 border border-slate-700 bg-slate-900 shadow-2xl relative">
            <button 
              onClick={() => setPreviewDoc(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl">
                📄
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{previewDoc.name}</h3>
                <span className="text-xs text-slate-400 font-mono">Category: {previewDoc.type} • {previewDoc.size}</span>
              </div>
            </div>

            <div className="bg-slate-950 rounded-xl p-6 border border-slate-800 text-xs text-slate-300 font-mono space-y-3 max-h-64 overflow-y-auto">
              <p className="text-cyan-400 font-bold">// FLYTBASE OS - SECURE DELIVERY REPOSITORY DOCUMENT</p>
              <p>PROJECT: {project.name}</p>
              <p>CLIENT: {project.client}</p>
              <p>DOCUMENT DIGEST: SHA-256 Verified (0x9F4C...B82A)</p>
              <hr className="border-slate-800" />
              <p className="text-slate-400 leading-relaxed">
                This document serves as formal engineering verification for autonomous drone operations under FlytBase Cloud fleet management. All BVLOS telemetry gateways, geofence barriers, and fail-safe triggers have been audited and signed off by lead delivery engineers.
              </p>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Upload Document */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel rounded-2xl w-full max-w-md p-6 border border-slate-700 bg-slate-900 shadow-2xl relative">
            <button 
              onClick={() => setIsUploadOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Upload className="w-5 h-5 text-red-400" /> Upload Project Document
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Add SOWs, FAA waivers, or architecture blueprints to this project.
            </p>

            <form onSubmit={handleUpload} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Document File Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flight-Corridor-Telemetry-Spec.pdf"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Document Classification</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-red-500"
                >
                  <option value="SOW">SOW / Delivery Contract</option>
                  <option value="FAA Clearance">FAA Clearance / Waiver</option>
                  <option value="Architecture">Technical Architecture</option>
                  <option value="Financials">Financials / Budget</option>
                  <option value="Survey">Site Survey Report</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="vaultVisible"
                  checked={docVisible}
                  onChange={(e) => setDocVisible(e.target.checked)}
                  className="rounded border-slate-700 text-red-600 focus:ring-red-500"
                />
                <label htmlFor="vaultVisible" className="text-slate-300">
                  Visible to Customer in Warp-Portal
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-600/30"
                >
                  Upload File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
