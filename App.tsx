
import React, { useState } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import AnalysisResults from './components/AnalysisResults';
import { analyzeRequirements } from './services/requirementService';
import { RequirementAnalysis, AnalysisStatus } from './types';

type View = 'dashboard' | 'history' | 'team';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [results, setResults] = useState<RequirementAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (text: string) => {
    setStatus('analyzing');
    setError(null);
    try {
      const data = await analyzeRequirements(text);
      setResults(data);
      setStatus('completed');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to analyze requirements. Please try again.');
      setStatus('error');
    }
  };

  const resetProject = () => {
    setStatus('idle');
    setResults(null);
    setError(null);
    setCurrentView('dashboard');
  };

  const renderContent = () => {
    if (currentView === 'history') {
      return (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800">No History Found</h2>
          <p className="text-slate-500 mt-2">Your analyzed projects will appear here.</p>
        </div>
      );
    }

    if (currentView === 'team') {
      return (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Team Collaboration</h2>
          <p className="text-slate-500 mt-2">Manage your analysts and engineers here.</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Sidebar / Input Area */}
        <aside className="w-full lg:w-1/3 space-y-6">
          <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200">
            <h2 className="text-xl font-bold mb-2">Smart Analyzer</h2>
            <p className="text-indigo-100 text-sm opacity-90 leading-relaxed">
              Transforming business needs into executable technical specifications using enterprise logic patterns.
            </p>
            <div className="mt-6 flex items-center gap-4 text-xs font-semibold text-indigo-200 uppercase tracking-widest">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full border-2 border-indigo-400 flex items-center justify-center mb-1 bg-indigo-500">1</div>
                Input
              </div>
              <div className="flex-1 h-0.5 bg-indigo-400 mb-4 opacity-30"></div>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-1 ${status === 'analyzing' || status === 'completed' ? 'bg-white text-indigo-600 border-white' : 'border-indigo-400 opacity-50'}`}>2</div>
                Process
              </div>
              <div className="flex-1 h-0.5 bg-indigo-400 mb-4 opacity-30"></div>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-1 ${status === 'completed' ? 'bg-white text-indigo-600 border-white' : 'border-indigo-400 opacity-50'}`}>3</div>
                Design
              </div>
            </div>
          </div>

          <InputForm onAnalyze={handleAnalyze} isLoading={status === 'analyzing'} />

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex gap-3 text-rose-800 text-sm">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
        </aside>

        {/* Right Main Content / Results Area */}
        <div className="w-full lg:w-2/3">
          {status === 'idle' && (
            <div className="h-96 flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.642.316a6 6 0 01-3.86.517l-2.388-.477a2 2 0 00-1.022.547l-1.168 1.168a2 2 0 001.035 3.03l2.422.485a4 4 0 013.253 3.13l.235 1.175a2 2 0 003.746 0l.235-1.175a4 4 0 013.253-3.13l2.422-.485a2 2 0 001.035-3.03l-1.168-1.168z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Ready to Start Analysis</h3>
              <p className="text-slate-500 max-w-sm">Enter client requirements on the left to generate technical modules, APIs, and automation logic.</p>
            </div>
          )}

          {status === 'analyzing' && (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-pulse">
                <div className="h-8 bg-slate-100 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-slate-50 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-50 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-50 rounded w-2/3"></div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-pulse">
                  <div className="h-4 bg-slate-100 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-50 rounded w-full"></div>
                    <div className="h-3 bg-slate-50 rounded w-full"></div>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-pulse">
                  <div className="h-4 bg-slate-100 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-50 rounded w-full"></div>
                    <div className="h-3 bg-slate-50 rounded w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {status === 'completed' && results && (
            <AnalysisResults data={results} />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100">
      <Header 
        currentView={currentView} 
        setView={setCurrentView} 
        onNewProject={resetProject} 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {renderContent()}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">
            &copy; 2024 ReqAnalyzer Pro Logic System. Built for Enterprise Excellence.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
