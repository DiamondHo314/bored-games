import { Route } from "react-router-dom";

function RegisterLoginForm({ headingText, ...props }) {
  let footerText = "Don't have an account? ";
  let footerLink = "/register";
  let footerAction = "Register";
  if (props.isRegisterPage) {
   footerText = "Back to "; 
   footerLink = "/";
   footerAction = "login";
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200">
      <div className="w-96 bg-white rounded-3xl shadow-2xl p-10 border-4 border-yellow-300">
        <form className="space-y-7" method="POST" action="/login">
        <h1 className="text-center text-2xl font-bold text-blue-700 mb-5">
          {headingText || "Login"}
          </h1>
          <div>
            <label className="block text-blue-700 font-bold mb-2 tracking-wide">
              Username
            </label>
            <input
              type="text"
              name="username"
              className="w-full px-5 py-3 border-2 border-pink-300 rounded-full focus:outline-none focus:ring-4 focus:ring-yellow-200 bg-pink-50 text-lg transition"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="block text-blue-700 font-bold mb-2 tracking-wide">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full px-5 py-3 border-2 border-pink-300 rounded-full focus:outline-none focus:ring-4 focus:ring-yellow-200 bg-pink-50 text-lg transition"
              autoComplete="current-password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-400 via-yellow-300 to-blue-400 text-white py-3 rounded-full font-extrabold text-lg shadow-md hover:scale-105 hover:from-pink-500 hover:to-blue-500 transition-all duration-200"
          >
            Let's Play!
          </button>
        </form>
          <div className="mt-8 text-center">
            <span className="text-blue-600 font-semibold">{footerText}</span>
            <a
              href={footerLink}
              className="text-pink-500 hover:underline font-bold"
            >
            {footerAction}
            </a>
          </div>
        </div>
    </div>
  );
}

export default RegisterLoginForm;