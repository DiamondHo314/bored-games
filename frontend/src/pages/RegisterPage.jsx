import RegisterLoginForm from "../components/RegisterLoginForm";
function RegisterPage() {
  return (
    <div>
      <RegisterLoginForm
        headingText="Register"
        isRegisterPage={true}
       />
    </div>
  );
}

export default RegisterPage;