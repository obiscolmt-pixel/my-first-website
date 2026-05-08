import { useState, useEffect } from "react";

const UpdateNotification = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              setWaitingWorker(newWorker);
              setShowUpdate(true);
            }
          });
        });
      });

      // Check if there's already a waiting worker
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setShowUpdate(true);
        }
      });
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
    }
    setShowUpdate(false);
    window.location.reload();
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 z-[999] flex justify-center px-4">
      <div className="bg-gray-900 text-white rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3 max-w-sm w-full">
        <span className="text-2xl">🔄</span>
        <div className="flex-1">
          <p className="font-bold text-sm">New update available!</p>
          <p className="text-xs text-gray-400">Tap to get the latest version</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowUpdate(false)}
            className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded-lg transition"
          >
            Later
          </button>
          <button
            onClick={handleUpdate}
            className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-full transition"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateNotification;