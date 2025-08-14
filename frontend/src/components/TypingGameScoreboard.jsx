import React, { useEffect, useState, useRef } from 'react';

function TypingGameScoreboard({ gameTitle = "Typing Game" }) {
    const [scores, setScores] = useState({
        fifteen: [],
        thirty: [],
        sixty: [],
    });
    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef(null);

    const BACKEND_URL = 'http://localhost:8080';

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/scores/typing`, {
                    credentials: 'include',
                });
                if (res.ok) {
                    const data = await res.json();
                    setScores(data);
                    console.log("Retrieved typing game scores:", data);
                } else {
                    console.error("Failed to fetch typing game scores");
                }
            } catch (error) {
                console.error("Error fetching typing game scores:", error);
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

    const renderTable = (label, rows, wpmKey, accKey) => {
        // Filter out rows where both WPM and accuracy are null or undefined
        const filteredRows = rows.filter(
            row => row[wpmKey] != null || row[accKey] != null
        );
        return (
            <div className="mb-6">
                <h3 className="font-semibold mb-2">{label}</h3>
                <table className="w-full border-collapse mb-2">
                    <thead>
                        <tr>
                            <th className="border-b p-2 text-center">Sl.</th>
                            <th className="border-b p-2 text-center">WPM</th>
                            <th className="border-b p-2 text-center">Accuracy (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRows.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="p-2 text-center">No scores yet.</td>
                            </tr>
                        ) : (
                            filteredRows.map((row, idx) => (
                                <tr key={idx}>
                                    <td className="p-2 border-b text-center">{idx + 1}</td>
                                    <td className="p-2 border-b text-center">{row[wpmKey] !== null ? row[wpmKey] : '-'}</td>
                                    <td className="p-2 border-b text-center">{row[accKey] !== null ? row[accKey] : '-'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div>
            <a
                className="cursor-pointer underline"
                onClick={() => setShowPopup(true)}
            >
                {gameTitle} Scores
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
                        className="bg-white p-6 rounded-lg min-w-[340px] shadow-lg"
                        style={{ width: '420px', maxWidth: '98vw', maxHeight: '92vh', overflowY: 'auto' }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="m-0 text-lg font-semibold">{gameTitle} Scores</h2>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="text-xl font-bold cursor-pointer px-2 py-1 rounded hover:bg-gray-200"
                            >
                                ×
                            </button>
                        </div>
                        {renderTable(
                            "15 Seconds",
                            scores.fifteen || [],
                            "fifteen_seconds_wpm",
                            "fifteen_seconds_acc"
                        )}
                        {renderTable(
                            "30 Seconds",
                            scores.thirty || [],
                            "thirty_seconds_wpm",
                            "thirty_seconds_acc"
                        )}
                        {renderTable(
                            "60 Seconds",
                            scores.sixty || [],
                            "sixty_seconds_wpm",
                            "sixty_seconds_acc"
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default TypingGameScoreboard;