"use client";

import { useRouter } from "next/navigation";
import axios from "axios";

export default function Home() {
    const router = useRouter();

    let email = "";
    let password = "password";
    let userType = 1;

    const roleHandler = async (type: "client" | "advocate") => {
        if (type === "client") {
            userType = 1;
            email = "alyazzar14+27@gmail.com";
        } else {
            userType = 2;
            email = "ibnu+200@mykonsul.com";
            password = "1234567890";
        }

        const result = await login();
        if (result) router.push("/room-chat?role=" + type);
    };

    const login = async () => {
        try {
            const data = {
                email: email,
                password: password,
                userType: userType,
            };

            const response = await axios.post(
                process.env.NEXT_PUBLIC_API_ACCOUNT + "/auth" || "",
                data,
            );
            const token = response.data.data.accessToken;

            localStorage.setItem("token", token);
            return true;
        } catch (error) {
            console.error("Error:", error);
            return false;
        }
    };

    return (
        <div className={"flex w-full flex-col p-10"}>
            <div className={"flex flex-row gap-4"}>
                <button
                    onClick={() => roleHandler("client")}
                    className="mt-2 w-fit rounded bg-green-600 p-2 px-4 text-white"
                >
                    Client
                </button>

                <button
                    onClick={() => roleHandler("advocate")}
                    className="mt-2 w-fit rounded bg-blue-600 p-2 px-4 text-white"
                >
                    Advocate
                </button>
            </div>
        </div>
    );
}
