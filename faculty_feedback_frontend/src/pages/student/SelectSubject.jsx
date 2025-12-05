import { useEffect, useState } from "react";
import { getSubjects } from "../../services/studentServices";
import { useNavigate } from "react-router-dom";

export default function SelectSubject() {
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await getSubjects();
      setSubjects(res.data);
    } catch (err) {
      alert("Error loading subjects");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Select Subject</h2>

      {subjects.map((s) => (
        <div key={s.id} style={{ border: "1px solid #ccc", padding: 10, marginTop: 10 }}>
          <p>{s.name} — {s.faculty_name}</p>
          <button onClick={() => navigate(`/feedback/${s.id}`)}>Give Feedback</button>
        </div>
      ))}
    </div>
  );
}
