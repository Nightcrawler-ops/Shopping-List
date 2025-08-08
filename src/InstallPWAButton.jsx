import { useEffect, useState } from "react";

function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false); // 🚀 Start hidden

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true); // ✅ Show when ready to install
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Optional: hide button after install
    window.addEventListener("appinstalled", () => {
      setDeferredPrompt(null);
      setVisible(false);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
        setVisible(false); // Hide after use
      });
    }
  };

  if (!visible) return null; // ❌ Hide if not ready

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        backgroundColor: "#1d216e",
        color: "white",
        padding: "8px 12px",
        borderRadius: "50px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      }}
    >
      {/* Install Button */}
      <button
        onClick={handleInstallClick}
        style={{
          background: "none",
          border: "none",
          color: "white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          fontSize: "14px",
        }}
      >
        <img
          className="addicon"
          src="/download.png"
          alt="install"
          style={{ width: "20px", height: "20px", marginRight: "8px" }}
        />
        Install App
      </button>

      {/* Close Button */}
      <button
        onClick={() => setVisible(false)}
        style={{
          marginLeft: "0px",
          background: "transparent",
          border: "none",
          color: "white",
          fontSize: "16px",
          cursor: "pointer",
        }}
        title="Close"
      >
        ✕
      </button>
    </div>
  );
}

export default InstallPWAButton;
