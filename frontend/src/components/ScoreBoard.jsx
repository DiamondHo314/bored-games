import { useEffect, useState, useRef } from 'react';

function ScoreBoard(props) {
    const [scoreboardData, setScoreboardData] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef(null);

    const BACKEND_URL = 'http://localhost:8080'; 
    useEffect(() => {
        // Fetch the scoreboard data from the backend
        const fetchScores = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/scores/chimp`, {
                    credentials: 'include', // Include credentials for session management
                });
                if (res.ok) {
                    const data = await res.json();
                    setScoreboardData(data);
                    console.log("Scoreboard data:", data);
                    // Process and display the scoreboard data as needed
                } else {
                    console.error("Failed to fetch scores");
                }
            } catch (error) {
                console.error("Error fetching scores:", error);
            }
        };
        fetchScores();

    }, []);

    // Close popup when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowPopup(false);
            }
        }
        if (showPopup) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showPopup]);

    return (
        <div>
            <a
                className="cursor-pointer underline"
                onClick={() => setShowPopup(true)}
            >
                {props.gameTitle}
            </a>
            {showPopup && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    style={{
                        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0) 100%)'
                    }}
                >
                    <div
                        ref={popupRef}
                        className="bg-white p-6 rounded-lg min-w-[320px] shadow-lg"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="m-0 text-lg font-semibold">{props.gameTitle} Scores</h2>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="text-xl font-bold cursor-pointer px-2 py-1 rounded hover:bg-gray-200"
                            >
                                ×
                            </button>
                        </div>
                        <table className="w-full mt-2 border-collapse">
                            <thead>
                                <tr>
                                    <th className="border-b text-center p-2">Sl.</th>
                                    <th className="border-b text-center p-2">Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scoreboardData.length === 0 ? (
                                    <tr>
                                        <td colSpan={2} className="p-2 text-center">No scores yet.</td>
                                    </tr>
                                ) : (
                                    scoreboardData.map((row, idx) => (
                                        <tr key={idx}>
                                            <td className="p-2 border-b">{idx + 1}</td>
                                            <td className="p-2 border-b">{row.score}s</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ScoreBoard;