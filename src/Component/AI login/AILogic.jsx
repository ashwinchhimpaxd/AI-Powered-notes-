function AIPanel({ editor }) {
    const handleRewrite = async () => {
        console.log(editor.getJSON());
        if (!editor) return;
        const userText = editor.getJSON();
        console.log(userText);
        const response = await fetch("https://YOUR_AI_API_URL", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: userText }),
        });

        const data = await response.json();

        // ✅ AI ka result editor me daala
        editor.commands.setContent(data.result);
    };

    return (
        <div className="w-[300px] p-4 absolute bottom-0 right-0 border-blue-300 bg-black ">
            <h2 className="text-white text-lg mb-4">AI Tools</h2>

            <button
                onClick={handleRewrite}
                className="bg-blue-600 w-full py-2 rounded-lg text-white mb-2"
            >
                Rewrite
            </button>

            <button className="bg-green-600 w-full py-2 rounded-lg text-white mb-2" onClick={() => {
                handleRewrite();
            }}>
                Summarize
            </button>

            <button className="bg-purple-600 w-full py-2 rounded-lg text-white">
                Expand
            </button>
        </div>
    );
}

export default AIPanel;
