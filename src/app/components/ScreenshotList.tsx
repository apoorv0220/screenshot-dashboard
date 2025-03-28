import Image from 'next/image';

interface ScreenshotListProps {
  screenshots: { url: string; timestamp: string }[];
}

const ScreenshotList: React.FC<ScreenshotListProps> = ({ screenshots }) => {
  return (
    <div>
      <h2>Screenshots</h2>
      <div style={{ display: 'flex', overflowX: 'auto', padding: '10px 0' }}>
        {screenshots.map((screenshot, index) => (
          <div key={index} style={{ margin: '0 10px', flexShrink: 0 }}>
            <Image
              src={screenshot.url}
              alt={`Screenshot ${index + 1}`}
              width={200}
              height={150}
              style={{ objectFit: 'cover', borderRadius: '8px' }}
            />
            <p style={{ fontSize: '0.8em', color: '#555' }}>{new Date(screenshot.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScreenshotList;