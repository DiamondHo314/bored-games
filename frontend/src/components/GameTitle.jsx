
function GameTitle({ gameName }) {
  const gametitle = gameName || "coming-soon";
  return (
    <div className="w-full flex justify-center my-4">
      <a
        href={`/${gametitle}`}
        className="block w-72 bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg rounded-xl p-6 text-center text-3xl font-extrabold text-white hover:scale-105 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 border-4 border-transparent hover:border-yellow-400"
      >
        {gametitle}
      </a>
    </div>
  );
}

export default GameTitle;