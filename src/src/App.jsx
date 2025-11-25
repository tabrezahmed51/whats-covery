import { useState } from 'react';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning process
    setTimeout(() => setIsScanning(false), 2000);
  };

  return (
    <div className="min-h-screen bg-cyber-bg text-white font-mono">
      <header className="bg-cyber-surface border-b-2 border-cyber-accent p-6">
        <h1 className="text-3xl font-bold text-cyber-accent">🔧 Whats-Covery</h1>
        <p className="text-gray-400 mt-2">WhatsApp Recovery Tool - Cyberpunk Edition</p>
      </header>
      
      <main className="container mx-auto p-8">
        <div className="bg-cyber-surface border-2 border-cyber-purple rounded-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl mb-4 text-cyber-accent">Select WhatsApp Backup</h2>
          
          <div className="mb-6">
            <input 
              type="file" 
              onChange={handleFileSelect}
              className="w-full p-3 bg-cyber-bg border border-cyber-accent rounded text-white"
            />
          </div>

          {selectedFile && (
            <div className="mb-6 p-4 bg-cyber-bg border border-cyber-purple rounded">
              <p className="text-cyber-accent">Selected: {selectedFile.name}</p>
            </div>
          )}

          <button 
            onClick={handleScan}
            disabled={!selectedFile || isScanning}
            className="w-full py-3 bg-cyber-accent text-cyber-bg font-bold rounded hover:bg-cyber-purple transition-colors disabled:opacity-50"
          >
            {isScanning ? 'Scanning...' : 'Start Recovery'}
          </button>
        </div>

        <div className="mt-8 text-center text-gray-500">
          <p>Built with React 18 + Vite 5 + Tailwind CSS 3</p>
          <p className="mt-2">Features: Selective Scanning • Incremental Recovery • De-duplication • ZIP Export</p>
        </div>
      </main>
    </div>
  );
}

export default App;