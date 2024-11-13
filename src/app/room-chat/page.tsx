"use client";

import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

let socket: Socket;

export default function RoomChat() {
    // const {} =

    const router = useRouter();
    const role = useSearchParams().get("role");

    const type = role === "client" ? "1" : "2";
    const room_id = "6732169a3bd14825e88b6047";

    const [currentSocket, setCurrentSocket] = useState<{
        room: string;
        status: boolean;
    }>({ room: "", status: false });
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<
        { sender: string; content: string }[]
    >([]);

    const handleMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found");
            router.push("/");
            return;
        }

        // Koneksikan ke backend API Socket.IO
        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "", {
            extraHeaders: {
                type: type,
                Authorization: "Bearer " + token,
            },
        });

        socket.on("connect", () => {
            console.log("Connected to socket server");
            socket.emit("event.join", { room: room_id }); // join room setelah terkoneksi
            setCurrentSocket({ room: room_id, status: true });
        });

        socket.on("disconnect", (reason) => {
            console.log("Disconnected from socket server:", reason);
            setCurrentSocket({ room: "", status: false });
        });

        // Mendengarkan pesan yang diterima
        // socket.on("event.message", (data) => {
        //     console.log("Message:", data);
        //
        //     setMessages((prevMessages) => [
        //         ...prevMessages,
        //         { sender: data.sender, content: data.message },
        //     ]);
        // });

        // Bersihkan socket ketika komponen unmount
        return () => {
            socket.disconnect();
            setCurrentSocket({ room: "", status: false });
        };
    }, [type, router]);

    const getDiscussionMessageByRoom = async (room_id: string) => {
        try {
            const params = [];
            console.log("room_id", room_id);

            const page = 1;
            const limit = 3;

            params.push(`page=${page}`);
            params.push(`limit=${limit}`);
            params.push(`room=${room_id}`);

            const paramsString = "?" + params.join("&");

            const response = await axios.get(
                process.env.NEXT_PUBLIC_API_URL +
                    "/chat/discussion" +
                    room_id +
                    paramsString,
            );
            return response.data;
        } catch (error) {
            console.error("Error:", error);
            return false;
        }
    };

    const disconnectSocket = () => {
        if (!socket) {
            console.log("Socket is not connected");
            setCurrentSocket({ room: "", status: false });
            return;
        }

        socket.disconnect();

        socket.on("disconnect", (reason) => {
            console.log("Disconnected from socket server:", reason);
            setCurrentSocket({ room: "", status: false });
        });

        router.push("/");
    };

    const sendMessage = () => {
        const newMessage = { room: room_id, message: message };

        socket.emit("event.message", newMessage);

        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "Ibnu", content: message },
        ]);
        setMessage("");
    };

    return (
        <div className={"flex w-full flex-col p-10"}>
            <div>halo</div>
            <h1>User: {role}</h1>
            <h1>Room: {currentSocket.room}</h1>
            <h1>
                Status: {currentSocket.status ? "Connected" : "Not Connected"}
            </h1>

            <div className={"flex flex-row gap-4"}>
                <button
                    onClick={disconnectSocket}
                    className="mt-2 w-fit rounded bg-red-800 p-2 px-4 text-white"
                >
                    Disconnect Socket
                </button>
            </div>

            <div className={"flex flex-col"}>
                {/*{getDiscussionList().then((data) => {*/}
                {/*    console.log("Data:", data?.items);*/}
                {/*    const docs = data?.items;*/}
                {/*    return (*/}
                {/*        <div className={"flex flex-row gap-4"}>*/}
                {/*            {docs &&*/}
                {/*                docs.map((item: any, index: number) => {*/}
                {/*                    console.log("Discussion:", item);*/}
                {/*                    return (*/}
                {/*                        <button*/}
                {/*                            key={index}*/}
                {/*                            // onClick={() => {*/}
                {/*                            //     getDiscussionMessageByRoom(*/}
                {/*                            //         item.id || "",*/}
                {/*                            //     ).then((data) => {*/}
                {/*                            //         console.log(data);*/}
                {/*                            //     });*/}
                {/*                            // }}*/}
                {/*                            className="mt-2 w-fit rounded bg-green-600 p-2 px-4 text-white"*/}
                {/*                        >*/}
                {/*                            {item.title} asdasasd*/}
                {/*                        </button>*/}
                {/*                    );*/}
                {/*                })}*/}
                {/*        </div>*/}
                {/*    );*/}
                {/*})}*/}
            </div>

            <div
                className={
                    "mt-10 flex flex-col gap-2 rounded border border-neutral-400 p-4"
                }
            >
                {messages.map((msg, index) => (
                    <div key={index} className="flex flex-row gap-2">
                        <span>&bull;</span>
                        <span>{type} : </span>
                        <p>{msg.content}</p>
                    </div>
                ))}
            </div>

            <div className={"mt-10 flex flex-row gap-4"}>
                <input
                    type="text"
                    value={message}
                    onChange={handleMessage}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            sendMessage();
                        }
                    }}
                    className={
                        "w-full max-w-[50%] rounded border border-neutral-400 p-4"
                    }
                />

                <button
                    onClick={sendMessage}
                    className="w-fit rounded bg-neutral-600 p-4 px-4 text-white"
                >
                    Send Message
                </button>
            </div>
        </div>
    );
}
