import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import emailjs from "emailjs-com";
import CryptoJS from "crypto-js";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const circle1 = useRef(null);
  const circle2 = useRef(null);
  const circle3 = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // GSAP animation for the circles
    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    tl.to(circle1.current, {
      duration: 6,
      borderRadius: [
        "40% 60% 60% 40% / 40% 60% 40% 60%",
        "60% 40% 30% 70% / 70% 30% 60% 40%",
        "50% 50% 50% 50% / 50% 50% 50% 50%",
      ],
      scale: [1, 1.2, 1.1],
      ease: "easeInOut",
    })
      .to(circle2.current, {
        duration: 7,
        borderRadius: [
          "40% 60% 60% 40% / 40% 60% 40% 60%",
          "70% 30% 50% 50% / 30% 70% 50% 50%",
          "50% 50% 50% 50% / 50% 50% 50% 50%",
        ],
        scale: [1, 1.15, 0.9],
        ease: "easeInOut",
      })
      .to(circle3.current, {
        duration: 5,
        borderRadius: [
          "30% 70% 50% 50% / 50% 50% 30% 70%",
          "60% 40% 40% 60% / 60% 40% 40% 60%",
          "50% 50% 50% 50% / 50% 50% 50% 50%",
        ],
        scale: [1, 1.1, 1.05],
        ease: "easeInOut",
      });
  }, []);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [resendAvailable, setResendAvailable] = useState(false);
  const [timer, setTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);

  const allowedEmails = (import.meta.env.VITE_ALLOWED_ADMIN_EMAILS || "").split(
    ","
  );
  // Generate a 6-digit OTP
  const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    setGeneratedOtp(otp.toString());
    return otp.toString();
  };

  // Handle sending OTP via EmailJS
  const handleSendOtp = async () => {
    if (!allowedEmails.includes(email)) {
      toast.error(
        "Please enter the email which has permission to access the admin panel."
      );
      return;
    }

    const otp = generateOtp();
    const encryptedOtp = CryptoJS.AES.encrypt(
      otp,
      import.meta.env.VITE_SECRET_KEY
    ).toString();

    // Reassign templateParams to ensure it updates with the latest email
    const templateParams = {
      to_email: email,
      otp_code: otp, // Plain OTP to email
    };

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_USER_ID
      );
      setShowOtpInput(true);
      setOtpSent(true);
      setResendAvailable(false);
      startTimer();
    } catch (error) {
      alert("Failed to send OTP. Please try again.");
    }
  };

  // Start a countdown timer for Resend OTP
  const startTimer = () => {
    let countdown = 30;
    setTimer(countdown);
    setResendAvailable(false); // Disable Resend OTP for now
    const intervalId = setInterval(() => {
      countdown -= 1;
      setTimer(countdown);
      if (countdown <= 0) {
        clearInterval(intervalId);
        setResendAvailable(true); // Enable Resend OTP after 30 seconds
      }
    }, 1000);
  };

  // Handle OTP verification
  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      localStorage.setItem("isAdminLoggedIn", "true"); // Set logged-in state
      toast.success("OTP verified successfully! Redirecting...", {
        position: "top-right",
        autoClose: 2000, // Match the timeout for redirection
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      // Redirect to admin panel after toast
      setTimeout(() => {
        navigate("/admin-panel");
      }, 2000); // delay for toast notification before redirect
    } else {
      toast.error("Incorrect OTP. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  // Handle Resending OTP
  const handleResendOtp = () => {
    handleSendOtp();
  };

  // Function to handle Enter key press on the email field
  const handleEmailKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendOtp(); // Trigger Send OTP on pressing Enter
    }
  };

  // Function to handle Enter key press on the OTP field
  const handleOtpKeyPress = (event) => {
    if (event.key === "Enter") {
      handleVerifyOtp(); // Trigger Verify OTP on pressing Enter
    }
  };

  return (
    <div className="relative overflow-hidden admin-login flex flex-col justify-center items-center px-8 py-8 sm:px-12 md:px-20 lg:px-40 lg:py-24 h-screen w-full bg-primaryColor">
      {/* Random animated blurred morphing circles */}
      <div
        ref={circle1}
        className="absolute bg-red-700/30 blur-3xl w-60 h-60 sm:w-80 sm:h-80 -right-24 -top-24"
      ></div>
      <div
        ref={circle2}
        className="absolute bg-blue-700/30 blur-3xl w-60 h-60 sm:w-80 sm:h-80 top-1/3 -left-24"
      ></div>
      <div
        ref={circle3}
        className="absolute bg-orange-600/40 blur-3xl w-60 h-60 sm:w-80 sm:h-80 -bottom-24 -right-24"
      ></div>

      {/* Login Form */}
      <div className="relative z-10 flex flex-col items-center justify-center shadow-lg border-2 border-gray-300 text-tertiaryColor p-8 sm:p-12 md:p-16 rounded-3xl w-full max-w-lg">
        <h1 className="text-center text-2xl font-semibold">Admin Login</h1>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleEmailKeyPress} // Listen for Enter key on email field
          placeholder="Enter email here"
          className="py-2 px-4 mt-8 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-sixthColor rounded-lg w-full"
        />

        {/* OTP Input */}
        {showOtpInput && (
          <>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              onKeyPress={handleOtpKeyPress} // Listen for Enter key on OTP field
              placeholder="Enter 6-digit OTP"
              className="py-2 px-4 mt-4 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-sixthColor rounded-lg w-full"
            />
            <p className="mt-2 text-sm text-gray-500">
              OTP sent to your email. Valid for 30 seconds.
            </p>
          </>
        )}

        {/* Buttons */}
        <div className="flex flex-col items-center mt-6 w-full">
          <button
            onClick={otpSent ? handleVerifyOtp : handleSendOtp}
            className="bg-sixthColor text-white rounded-lg px-4 py-2 w-full hover:bg-sixthColorHover focus:outline-none focus:ring-2 focus:ring-sixthColor focus:ring-opacity-50"
          >
            {otpSent ? "Verify OTP" : "Send OTP"}
          </button>
          {otpSent && (
            <button
              onClick={handleResendOtp}
              disabled={!resendAvailable}
              className={`mt-4 bg-gray-400 text-white rounded-lg px-4 py-2 w-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 ${
                !resendAvailable ? "cursor-not-allowed" : ""
              }`}
            >
              Resend OTP {timer > 0 && `(${timer})`}
            </button>
          )}
        </div>
      </div>
      <Link
        to="/"
        className="text-[#9c9c9c] text-lg font-light hover:text-tertiaryColor hover:font-normal mt-16"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default AdminLogin;
