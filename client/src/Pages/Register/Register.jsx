import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import auth from "../../Firebase/firebase.config";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

const Register = () => {
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const accepted = e.target.terms.checked;
    console.log(name, email, password, accepted);

    // Reset Error & Success
    setRegisterError("");
    setRegisterSuccess("");

    if (password.length < 6) {
      setRegisterError("Password should be at least 6 characters or longer.");
      return;
    } else if (!/[A-Z]/.test(password)) {
      setRegisterError("Your password should have one upper case character.");
      return;
    } else if (!accepted) {
      setRegisterError("Please accept our terms & conditions!");
      return;
    }

    // Create User
    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        console.log(result.user);
        setRegisterSuccess("User Created Successfully.");

        // Update Profile
        updateProfile(result.user, {
          displayName: name,
          photoURL: "https://example.com/jane-q-user/profile.jpg",
        })
          .then(() => {
            console.log("Profile Updated");
          })
          .catch((error) => {
            console.log(error);
          });

        // Send verification email
        sendEmailVerification(result.user).then(() => {
          alert("Please check your email & verify the account.");
        });
      })
      .catch((error) => {
        console.log("Error", error);
        setRegisterError(error.message);
      });
  };
  return (
    <div>
      <div className='mx-auto mt-44 md:w-1/2'>
        <form onSubmit={handleRegister}>
          <h2 className='text-3xl mb-8 '>Please Register Here</h2>
          <input
            className='mb-4 w-3/4 py-2 px-5'
            type='text'
            name='name'
            placeholder='Your Name'
            required
          />
          <br />
          <input
            className='mb-4 w-3/4 py-2 px-5'
            type='email'
            name='email'
            placeholder='Email Address'
            required
          />
          <br />
          <div className='relative w-3/4'>
            <input
              className='w-full py-2 px-5 pr-10'
              type={showPassword ? "text" : "password"}
              name='password'
              placeholder='Password'
              required
            />
            <button
              type='button'
              className='absolute top-1/2 -translate-y-1/2 right-3'
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash></FaEyeSlash> : <FaEye></FaEye>}
            </button>
          </div>

          <br />
          <div className=''>
            <input type='checkbox' name='terms' id='terms' />
            <label className='ml-2 items-center' htmlFor='terms'>
              Accept our terms & conditions
            </label>
          </div>
          <br />
          <input
            className='btn btn-secondary mb-4 w-3/4'
            type='submit'
            value='Register'
          />
          <br />
        </form>
        {registerError && <p className='text-red-700'>{registerError}</p>}
        {registerSuccess && <p className='text-green-600'>{registerSuccess}</p>}
        <p>
          Already have an account? Please{" "}
          <Link to='/login'>
            <span className='underline'>Login</span>
          </Link>{" "}
        </p>
      </div>
    </div>
  );
};

export default Register;
