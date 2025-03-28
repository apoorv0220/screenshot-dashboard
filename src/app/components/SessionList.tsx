"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Session {
  sessionId: string;
  screenshots: { url: string; timestamp: string }[];
}

interface SessionListProps {
  onSessionSelect: (sessionId: string) => void;
  selectedSessionId: string | null;
}

interface SessionListResponse {
  sessions: Session[];
  totalSessions: number;
  totalPages: number;
  currentPage: number;
}

const SessionList: React.FC<SessionListProps> = ({
  onSessionSelect,
  selectedSessionId,
}) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;
  const screenshotsPerSession = 10;

  useEffect(() => {
    async function fetchSessions() {
      const response = await fetch(
        `/api/sessions?page=${currentPage}&limit=${limit}&screenshotsPerSession=${screenshotsPerSession}`
      );
      const data: SessionListResponse = await response.json();
      setSessions(data.sessions);
      setTotalPages(data.totalPages);
    }

    fetchSessions();
  }, [currentPage, limit, screenshotsPerSession]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-teal-500">
        Available Sessions
      </h2>
      <div className="flex flex-col items-center">
        {sessions.map((session) => (
          <div
            key={session.sessionId}
            className={`w-full max-w-md bg-gray-800 p-4 rounded-md border-2 ${
              selectedSessionId === session.sessionId
                ? "border-green-500"
                : "border-teal-500"
            } shadow-lg cursor-pointer hover:bg-gray-700 transition duration-200 mb-4`}
            onClick={() => onSessionSelect(session.sessionId)}
          >
            <h3 className="text-xl font-semibold mb-2 text-teal-300 font-mono">
              Session: {session.sessionId}
            </h3>
            <div className="flex overflow-x-auto py-2">
              {session.screenshots.map((screenshot, index) => (
                <div key={index} className="mr-4 flex-shrink-0">
                  <Image
                    src={screenshot.url}
                    alt={`Screenshot ${index + 1}`}
                    width={100}
                    height={75}
                    style={{ objectFit: "cover", borderRadius: "8px" }}
                    className="border border-gray-700 rounded-md shadow-md"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 rounded mr-2 disabled:opacity-50 transition duration-200"
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 rounded disabled:opacity-50 transition duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SessionList;
