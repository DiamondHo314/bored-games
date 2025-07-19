import RegisterLoginForm from "../components/RegisterLoginForm";
import { Link } from 'react-router-dom';

function LoginPage() {
  return (
    <div>
      <RegisterLoginForm />
     <div className="absolute top-6 left-10 flex gap-4">
        <Link to="/">
            Back to Menu
        </Link>
     </div>
    </div>
  );
}

export default LoginPage;