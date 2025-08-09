import { useState, useEffect } from "react";
import { Download, Smartphone } from "lucide-react";
import { pwaManager } from "@/pwa";

export function PWAInstallButton() {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check initial state
    setCanInstall(pwaManager.canInstall());
    setIsInstalled(pwaManager.getInstallStatus());

    // Listen for PWA events
    const handleInstallAvailable = () => setCanInstall(true);
    const handleInstallHide = () => setCanInstall(false);
    const handleInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
    };

    window.addEventListener('pwa-install-available', handleInstallAvailable);
    window.addEventListener('pwa-install-hide', handleInstallHide);
    window.addEventListener('pwa-installed', handleInstalled);

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('pwa-install-hide', handleInstallHide);
      window.removeEventListener('pwa-installed', handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const success = await pwaManager.installApp();
      if (success) {
        setIsInstalled(true);
        setCanInstall(false);
      }
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  if (isInstalled) {
    return (
      <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
        <Smartphone className="w-4 h-4" />
        <span>App Installed</span>
      </div>
    );
  }

  if (!canInstall) {
    return (
      <button
        onClick={handleInstall}
        disabled={true}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-200 dark:bg-gray-700 dark:text-gray-400 rounded-lg opacity-75"
        title="PWA install not available in this browser/environment"
      >
        <Download className="w-4 h-4" />
        Install App
      </button>
    );
  }

  return (
    <button
      onClick={handleInstall}
      disabled={isInstalling}
      className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className="w-4 h-4" />
      {isInstalling ? 'Installing...' : 'Install App'}
    </button>
  );
}