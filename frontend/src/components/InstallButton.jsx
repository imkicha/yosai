import { useState, useEffect } from "react";

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  if (!isInstallable) return <div></div>;

  return (
    <section className="bg-gradient-to-r from-pink-600 via-pink-500 to-pink-400 text-white py-16">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-extrabold mb-6 tracking-wide">Install Our Mobile App</h2>
        <p className="text-lg max-w-xl mx-auto mb-8">
          Don't miss any offers, updates, or rewards. Install now and stay connected!
        </p>
        <button
          onClick={handleInstallClick}
          className="bg-white text-pink-700 px-6 py-3 font-semibold rounded-full shadow-lg hover:bg-pink-50 transition duration-300"
        >
          Install App
        </button>
      </div>
    </section>
  );
}
