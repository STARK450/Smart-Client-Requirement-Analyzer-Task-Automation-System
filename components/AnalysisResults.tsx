
import React, { useState } from 'react';
import { RequirementAnalysis } from '../types';

interface AnalysisResultsProps {
  data: RequirementAnalysis;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ data }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState<'print' | 'download' | null>(null);

  const priorityColors = {
    High: 'bg-red-100 text-red-700 border-red-200',
    Medium: 'bg-orange-100 text-orange-700 border-orange-200',
    Low: 'bg-green-100 text-green-700 border-green-200',
  };

  const complexityColors = {
    High: 'bg-rose-50 text-rose-700 border-rose-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  const executeDownload = () => {
    const content = `
TECHNICAL DESIGN DOCUMENT
=========================
Project Summary: ${data.summary}
Business Priority: ${data.businessPriority}
Estimated Complexity: ${data.automationLogic.estimatedComplexity}
Effort: ${data.automationLogic.suggestedEffortHours} Hours

USER ROLES
----------
${data.userRoles.join('\n')}

FUNCTIONAL REQUIREMENTS
-----------------------
${data.functionalRequirements.map(r => `- ${r.title}: ${r.description}`).join('\n')}

NON-FUNCTIONAL REQUIREMENTS
---------------------------
${data.nonFunctionalRequirements.map(r => `- ${r.title}: ${r.description}`).join('\n')}

DATA VALIDATION RULES
---------------------
${data.dataValidationRules.map(v => `- ${v.field}: ${v.rule}`).join('\n')}

ERROR HANDLING
--------------
${data.errorHandlingScenarios.map(e => `- ${e.case}: ${e.resolution}`).join('\n')}

TECHNICAL TASKS
---------------
${data.taskBreakdown.map(t => `
Module: ${t.module}
Description: ${t.description}
APIs: ${t.apiEndpoints.join(', ')}
Database: ${t.databaseRequirements}
`).join('\n')}

TECH STACK
----------
${data.techStack.join(', ')}

BEST PRACTICES
--------------
${data.bestPractices.join('\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Technical_Design_Doc_${new Date().getTime()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const executePrint = () => {
    window.print();
  };

  const handleActionConfirm = () => {
    if (pendingAction === 'print') executePrint();
    if (pendingAction === 'download') executeDownload();
    setShowConfirm(false);
    setPendingAction(null);
  };

  const triggerConfirm = (action: 'print' | 'download') => {
    setPendingAction(action);
    setShowConfirm(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      {/* Confirmation Dialog Overlay */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 print:hidden">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-6 mx-auto">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 text-center mb-2">Confirm Document Generation</h3>
            <p className="text-slate-500 text-center mb-8">
              You are about to {pendingAction === 'print' ? 'open the print interface' : 'download a .TXT report'} for the current technical design. Proceed?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => { setShowConfirm(false); setPendingAction(null); }}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleActionConfirm}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overview Card */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 print:shadow-none print:border-none">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Analysis Summary</h2>
          <div className="flex gap-2 print:hidden">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${priorityColors[data.businessPriority]}`}>
              Priority: {data.businessPriority}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${complexityColors[data.automationLogic.estimatedComplexity]}`}>
              Complexity: {data.automationLogic.estimatedComplexity}
            </span>
          </div>
          <div className="hidden print:block text-sm font-bold uppercase text-slate-500">
            Priority: {data.businessPriority} | Complexity: {data.automationLogic.estimatedComplexity}
          </div>
        </div>
        <p className="text-slate-600 leading-relaxed text-lg mb-8">{data.summary}</p>
        
        {/* User Roles Section */}
        <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100 print:bg-transparent">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <svg className="w-3.5 h-3.5 print:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Identified User Roles
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.userRoles.map((role, idx) => (
              <span key={idx} className="px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold shadow-sm print:shadow-none">
                {role}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
              Functional Needs
            </h3>
            <ul className="space-y-3">
              {data.functionalRequirements.map((req, idx) => (
                <li key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100 print:bg-transparent">
                  <span className="block font-semibold text-slate-800 text-sm mb-1">{req.title}</span>
                  <span className="text-xs text-slate-500 leading-normal">{req.description}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
              Non-Functional Needs
            </h3>
            <ul className="space-y-3">
              {data.nonFunctionalRequirements.map((req, idx) => (
                <li key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100 print:bg-transparent">
                  <span className="block font-semibold text-slate-800 text-sm mb-1">{req.title}</span>
                  <span className="text-xs text-slate-500 leading-normal">{req.description}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Logic & Validation Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 print:shadow-none print:border-none">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-500 print:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Data Validation Rules
          </h3>
          <div className="space-y-3">
            {data.dataValidationRules.map((v, idx) => (
              <div key={idx} className="flex gap-4 p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl print:bg-transparent">
                <div className="flex-1">
                  <span className="text-xs font-bold text-emerald-700 block mb-1">{v.field}</span>
                  <p className="text-xs text-slate-600 italic leading-relaxed">"{v.rule}"</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 print:shadow-none print:border-none">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-rose-500 print:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Error Handling Strategy
          </h3>
          <div className="space-y-3">
            {data.errorHandlingScenarios.map((e, idx) => (
              <div key={idx} className="flex gap-4 p-3 bg-rose-50/50 border border-rose-100 rounded-xl print:bg-transparent">
                <div className="flex-1">
                  <span className="text-xs font-bold text-rose-700 block mb-1">{e.case}</span>
                  <p className="text-xs text-slate-600 leading-relaxed">{e.resolution}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Enhanced Technical Breakdown */}
      <section className="print:block">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Task Breakdown & Design</h2>
            <p className="text-sm text-slate-500">Proposed modular architecture and technical specifications.</p>
          </div>
          <div className="hidden md:flex gap-1">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            <div className="w-2 h-2 rounded-full bg-indigo-300"></div>
            <div className="w-2 h-2 rounded-full bg-indigo-100"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.taskBreakdown.map((task, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col hover:border-indigo-200 transition-colors group print:shadow-none print:border-slate-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-slate-900 leading-tight">{task.module}</h4>
              </div>
              
              <p className="text-sm text-slate-600 mb-6 flex-grow leading-relaxed">
                {task.description}
              </p>
              
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Interface Endpoints</label>
                  <div className="flex flex-wrap gap-1.5">
                    {task.apiEndpoints.map((ep, i) => (
                      <code key={i} className="px-2 py-0.5 bg-slate-50 text-slate-600 text-[10px] rounded font-mono border border-slate-100 group-hover:border-indigo-100 transition-colors print:bg-transparent">
                        {ep}
                      </code>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-100">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Data Persistence Strategy</label>
                  <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 italic group-hover:bg-indigo-50/30 transition-colors print:bg-transparent">
                    {task.databaseRequirements}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Logic & Automation Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm print:shadow-none print:border-none">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-500 print:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.642.316a6 6 0 01-3.86.517l-2.388-.477a2 2 0 00-1.022.547l-1.168 1.168a2 2 0 001.035 3.03l2.422.485a4 4 0 013.253 3.13l.235 1.175a2 2 0 003.746 0l.235-1.175a4 4 0 013.253-3.13l2.422-.485a2 2 0 001.035-3.03l-1.168-1.168z" />
            </svg>
            Automation Metrics
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium text-slate-600">
                <span>Estimated Effort</span>
                <span className="text-indigo-600 font-bold">{data.automationLogic.suggestedEffortHours} Hours</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden print:hidden">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${Math.min((data.automationLogic.suggestedEffortHours / 200) * 100, 100)}%` }}></div>
              </div>
            </div>
            <div className="pt-2">
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Risk Flags</span>
              <div className="flex flex-wrap gap-2">
                {data.automationLogic.riskFlags.map((flag, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-md border border-rose-100 print:bg-transparent">
                    {flag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm print:shadow-none print:border-none">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-500 print:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Tech Stack Suggestion
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.techStack.map((tech, idx) => (
              <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 print:bg-transparent">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm print:shadow-none print:border-none">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-500 print:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Best Practices
          </h3>
          <ul className="space-y-2">
            {data.bestPractices.map((practice, idx) => (
              <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                {practice}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 pb-12 print:hidden">
        <button 
          onClick={() => triggerConfirm('print')}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 00-2 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Design Doc
        </button>
        <button 
          onClick={() => triggerConfirm('download')}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download .TXT Report
        </button>
      </div>
    </div>
  );
};

export default AnalysisResults;
