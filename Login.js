import React, { useState } from "react";

function Login({ handleLogin, handleSignup }) {
    const [isSignup, setIsSignup] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const submit = (e) => {
        e.preventDefault();

        if (!email || !password || (isSignup && !name)) {
            alert("Please fill in all fields");
            return;
        }

        if (isSignup) {
            handleSignup(name, email, password);
        } else {
            handleLogin(email, password);
        }
    };

    return (
        <div style={{ width: "260px", textAlign: "center" }}>
            <h2>{isSignup ? "Create Account" : "Login"}</h2>

            <form onSubmit={submit}>

                {/* 🔥 NAME FIELD (ONLY FOR SIGNUP) */}
                {isSignup && (
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={inputStyle}
                    />
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputStyle}
                />

                <button type="submit" style={buttonStyle}>
                    {isSignup ? "Sign Up" : "Login"}
                </button>
            </form>

            <p
                onClick={() => {
                    setIsSignup(!isSignup);
                    setName(""); // reset name when switching
                }}
                style={toggleStyle}
            >
                {isSignup
                    ? "Already have an account? Login"
                    : "Create an account"}
            </p>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
};

const buttonStyle = {
    width: "100%",
    padding: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
};

const toggleStyle = {
    marginTop: "10px",
    cursor: "pointer",
    color: "#2563eb",
    fontSize: "14px"
};

export default Login;