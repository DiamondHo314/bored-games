import RegisterLoginForm from "../components/RegisterLoginForm";
import { Link } from 'react-router-dom';

function LoginPage() {
  return (
    <div>
      <RegisterLoginForm />
     <div className="absolute top-6 left-10 flex gap-4">
        <Link to="/">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition">
            Back to Menu
          </button>
        </Link>
     </div>
    </div>
  );
}

export default LoginPage;