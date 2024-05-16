import { LogoSvg } from "../../static/images/logos";
import AbstractImages from "../../static/images/abstract";
import { Link } from "react-router-dom";

const Register = () => {
  // Random Number generator
  const randomIndex = Math.floor(Math.random() * AbstractImages.length);
  const randomImage = AbstractImages[randomIndex];

  return (
    <div className="authentication">
      <div className="form">
        <div className="logo">
          <img src={LogoSvg} alt="The Resumes Online" />
        </div>
        <Link className="button">Login</Link>
      </div>
      <div className="image">
        <img src={randomImage} alt="Abstract" />
      </div>
      <h1>Register</h1>
    </div>
  );
};

export default Register;
