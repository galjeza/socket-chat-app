import {useState} from "react";
export default function ChooseUsername({setChosenUsername}) {
    const [username, setUsername] = useState("");
    return (
        <div className="flex items-center p-4 mx-auto min-h-screen justify-center bg-purple-500">
            <main className="gap-4 flex flex-col items-center justify-center w-full h-full">
                <>
                    <h3 className="font-bold text-white text-xl">
                        Vnesi svoje uporabniško ime
                    </h3>
                    <input
                        type="text"
                        placeholder="Ime..."
                        value={username}
                        className="p-3 rounded-md outline-none"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button
                        onClick={() => {
                            setChosenUsername(username);
                        }}
                        className="bg-white rounded-md px-4 py-2 text-xl"
                    >
                        Pridruži se klepetu
                    </button>
                </>

            </main>
        </div>
    )

}