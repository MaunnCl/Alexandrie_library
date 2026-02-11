import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/History.css";

interface HistoryItem {
  id: number;
  contentId: number;
  timeStamp: string;
}

interface Content {
  id: number;
  title: string;
  description: string;
  url: string;
  orator_id: number;
}

function formatTimestamp(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const pad = (n: number) => n.toString().padStart(2, "0");
  const date = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  return `${date}, ${time}`;
}

function History() {
  const [history, setHistory] = useState<(HistoryItem & { title?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    async function fetchHistory() {
      if (!userId) {
        console.warn("⚠️ Aucun userId trouvé dans localStorage");
        return;
      }
      try {
        console.log(`🔍 Fetching history for userId=${userId} ...`);
        const res = await api.get<HistoryItem[]>(`/api/history/${userId}`);
        console.log("✅ History response:", res.data);

        const historyData = res.data;

        // 2. pour chaque historique → récupérer le titre du contenu
        const contentPromises = historyData.map(async (h) => {
          try {
            console.log(`🔍 Fetching content for contentId=${h.contentId} ...`);
            const c = await api.get<Content>(`/api/contents/${h.contentId}`);
            console.log(`✅ Content #${h.contentId}:`, c.data.title);
            return { ...h, title: c.data.title };
          } catch (err) {
            console.error(`❌ Erreur récupération contentId=${h.contentId}`, err);
            return { ...h, title: `Content #${h.contentId}` };
          }
        });

        const enriched = await Promise.all(contentPromises);
        console.log("📦 Historique enrichi avec titres:", enriched);
        setHistory(enriched);
      } catch (err) {
        console.error("❌ Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [userId]);

  async function deleteItem(id: number) {
    try {
      console.log(`🗑️ Suppression de l'historique id=${id} ...`);
      await api.delete(`/api/history/${id}`);
      console.log(`✅ Item supprimé id=${id}`);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("❌ Error deleting history item:", err);
    }
  }

  return (
    <>
      <Navbar />
      <div className="history-page">
        <h1>Your History</h1>
        {loading ? (
          <p>Loading...</p>
        ) : history.length > 0 ? (
          <ul className="history-list">
            {history.map((item) => (
              <li key={item.id} className="history-item">
                <div
                  className="history-content"
                  onClick={() => navigate(`/watch/${item.contentId}`)}
                >
                  <p className="history-title">{item.title}</p>
                  <p className="history-date">Viewed at: {formatTimestamp(item.timeStamp)}</p>
                </div>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItem(item.id);
                  }}
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No history found.</p>
        )}
      </div>
      <Footer />
    </>
  );
}

export default History;
