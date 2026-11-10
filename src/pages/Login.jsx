import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        background: "#0f172a",
        color: "white"
      }}
    >
      <h1>EDUAI Demo</h1>

      <p>
        Explore EDUAI as a teacher or student.
      </p>

      <button
        onClick={() =>
          navigate("/teacher/class/period1_science/control")
        }
      >
        Teacher Demo
      </button>

      <button
        onClick={() =>
          navigate("/student")
        }
      >
        Student Demo
      </button>
    </div>
  );
}