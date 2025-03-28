import Image from 'next/image';
import { ScreenshotType } from '../models/Screenshot';
import { Key } from 'react';

interface ScreenshotListProps {
  screenshots: ScreenshotType[];
}

const ScreenshotList: React.FC<ScreenshotListProps> = ({ screenshots }) => {
  return (
    <div>
      <h2>Screenshots</h2>
      <div style={{ display: 'flex', overflowX: 'auto', padding: '10px 0' }}>
        {screenshots.map((screenshot) => (
          <div key={screenshot._id as Key} style={{ margin: '0 10px', flexShrink: 0 }}>
            <Image
              src={screenshot.url}
              alt={`Screenshot ${screenshot._id}`}
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