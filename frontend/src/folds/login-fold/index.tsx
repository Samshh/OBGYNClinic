import { useState, useEffect, useCallback, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginFold() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const navigate = useNavigate();

  const validateForm = useCallback(() => {
    const usernameValid = username.trim().length > 0;
    const passwordValid = password.length >= 8;
    setIsUsernameValid(usernameValid);
    setIsPasswordValid(passwordValid);
    setIsFormValid(usernameValid && passwordValid);
  }, [username, password]);

  useEffect(() => {
    validateForm();
  }, [username, password, validateForm]);

  const handleChange =
  (setter: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/doctor");
  };

  return (
    <section>
      <div className="flex flex-grow flex-col justify-center gap-[2rem] items-center">
        <form id="homeForm" onSubmit={handleSubmit}>
          <h1>
            Login<em className="font-normal text-accent">.</em>
          </h1>
          <div className="flex flex-col gap-[1rem]">
            <div className="flex flex-col gap-[0.5rem]">
              <label htmlFor="username">
                Username
                {!isUsernameValid && <span className="text-red-500"> *</span>}
              </label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="samshh"
                value={username}
                onChange={handleChange(setUsername)}
              />
            </div>
            <div className="flex flex-col gap-[0.5rem]">
              <label htmlFor="password">
                Password
                {!isPasswordValid && <span className="text-red-500"> *</span>}
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="8 Chars, Ab, 123, !#*"
                value={password}
                onChange={handleChange(setPassword)}
              />
            </div>
          </div>
          <button type="submit" className="specialButton" disabled={!isFormValid}>
            Login
          </button>
        </form>
      </div>
    </section>
  );
}
