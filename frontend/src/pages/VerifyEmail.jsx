import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SharedHeader from "../components/SharedHeader";
const API_URL = import.meta.env.VITE_API_URL;

function VerifyEmail() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

  const API_AUTH =
    import.meta.env.VITE_MODE === "development"
      ? `http://localhost:5000/api/auth/verify-email`
      : `${API_URL}/api/auth/verify-email`;

  useEffect(() => {
    // focus first input on mount
    setTimeout(() => {
      if (inputsRef.current[0]) inputsRef.current[0].focus();
    }, 0);
  }, []);

  const setDigitAt = (index, value) => {
    setDigits((d) => {
      const next = [...d];
      next[index] = value;
      return next;
    });
  };

  const handleChange = (e, idx) => {
    const raw = e.target.value || "";
    const onlyDigits = raw.replace(/\D/g, "");
    if (!onlyDigits) {
      setDigitAt(idx, "");
      return;
    }

    // If user pasted multiple digits into a single input, distribute them
    if (onlyDigits.length > 1) {
      const chars = onlyDigits.split("");
      setDigits((d) => {
        const next = [...d];
        let i = idx;
        for (const ch of chars) {
          if (i > 5) break;
          next[i] = ch;
          i += 1;
        }
        // after setting, focus the next empty or last filled
        setTimeout(() => {
          const focusIdx = Math.min(i, 5);
          inputsRef.current[focusIdx] && inputsRef.current[focusIdx].focus();
        }, 0);
        return next;
      });
      return;
    }

    // single digit typed
    setDigitAt(idx, onlyDigits);
    // move focus to next
    if (idx < 5) {
      setTimeout(
        () => inputsRef.current[idx + 1] && inputsRef.current[idx + 1].focus(),
        0,
      );
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      if (digits[idx]) {
        // if current has value, clear it
        setDigitAt(idx, "");
      } else if (idx > 0) {
        // move to previous
        inputsRef.current[idx - 1] && inputsRef.current[idx - 1].focus();
        setDigitAt(idx - 1, "");
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputsRef.current[idx - 1] && inputsRef.current[idx - 1].focus();
    } else if (e.key === "ArrowRight" && idx < 5) {
      inputsRef.current[idx + 1] && inputsRef.current[idx + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste =
      (e.clipboardData || window.clipboardData).getData("text") || "";
    const onlyDigits = paste.replace(/\D/g, "").slice(0, 6);
    if (!onlyDigits) return;
    const chars = onlyDigits.split("");
    setDigits((d) => {
      const next = [...d];
      let i = 0;
      for (; i < chars.length && i < 6; i++) {
        next[i] = chars[i];
      }
      setTimeout(() => {
        const focusIdx = Math.min(i, 5);
        inputsRef.current[focusIdx] && inputsRef.current[focusIdx].focus();
      }, 0);
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    setError("");
    const token = digits.join("");
    if (token.length !== 6) {
      setError("Please enter the 6-digit token");
      return;
    }

    setLoading(true);
    try {
      const url = API_AUTH;
      await axios.post(url, { code: token }, { withCredentials: true });
      navigate("/");
    } catch (err) {
      if (err.response)
        setError(err.response.data?.message || "Verification failed");
      else setError("Network error, try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SharedHeader />
      <main className="max-w-md mx-auto mt-24 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
            Verify Email
          </h1>
          <p className="text-gray-600 mb-6">
            Enter the 6-digit code sent to your email.
          </p>

          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-center gap-2">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  value={d}
                  onChange={(e) => handleChange(e, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  onPaste={i === 0 ? handlePaste : (e) => e.preventDefault()}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  className="w-12 h-12 text-center text-lg border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-200 outline-none"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-800 text-white rounded-lg font-semibold hover:bg-amber-900 transition"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default VerifyEmail;
