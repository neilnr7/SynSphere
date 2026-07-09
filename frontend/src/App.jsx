import Button from "@/components/ui/Button";

function App() {
    console.log(import.meta.env.VITE_API_BASE_URL);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 gap-6">
      <h1 className="text-5xl font-bold text-indigo-600">
        SynSphere Frontend
      </h1>
      
      <Button />
    </div>
  );
}

export default App; 

