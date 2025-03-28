interface SummaryProps {
  summary: string;
}

const Summary: React.FC<SummaryProps> = ({summary}) => {
  return (
      <div className="p-4 border border-gray-700 rounded-md">
          <h2 className="text-2xl font-semibold mb-2 text-teal-500">AI Summary</h2>
          <p className="text-gray-300">{summary || 'No summary available.'}</p>
      </div>
  );
};

export default Summary;