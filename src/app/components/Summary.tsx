interface SummaryProps {
    summary: string;
  }
  
  const Summary: React.FC<SummaryProps> = ({ summary }) => {
    return (
      <div>
        <h2>AI Summary</h2>
        <p>{summary || 'No summary available.'}</p>
      </div>
    );
  };
  
  export default Summary;