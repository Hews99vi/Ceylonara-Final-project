import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./dashboardPage.css";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (text) => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }).then((res) => res.json());
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      navigate(`/dashboard/chats/${id}`);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    mutation.mutate(text);
  };

  const handleAnalyze = () => {
    navigate('/dashboard/analyze-tea');
  };

  const handleManageState = () => {
    navigate('/dashboard/manage-state');
  };

  // Add handler for Harvest Planning
  const handleHarvestPlan = () => {
    navigate('/dashboard/harvest-plan');
  };

  return (
    <div className="dashboardPage">
      <div className="texts">
        <div className="logo">
          <img src="/logo.png" alt="" />
          <h1>Ceylonara</h1>
        </div>
        <div className="options">
          <div className="option" onClick={handleAnalyze}>
            <img src="/image.png" alt="" />
            <span>Analyze Images</span>
          </div>
          <div className="option" onClick={handleManageState}>
            <img src="/code.png" alt="" />
            <span>Manage My Tea State</span>
          </div>
          {/* Add Harvest Planning option */}
          <div className="option" onClick={handleHarvestPlan}>
            <img src="/calendar.png" alt="" />
            <span>Harvest Planning</span>
          </div>
        </div>
      </div>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <input type="text" name="text" placeholder="Ask me about tea..." />
          <button>
            <img src="/arrow.png" alt="" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;