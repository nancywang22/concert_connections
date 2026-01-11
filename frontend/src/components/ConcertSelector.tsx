import React from "react";

interface Concert {
  _id: string;
  name: string;
  date: string;
}

interface Props {
  concerts: Concert[];
  selectedConcert: Concert | null;
  setSelectedConcert: (concert: Concert) => void;
}

const ConcertSelector: React.FC<Props> = ({ concerts, selectedConcert, setSelectedConcert }) => {
  return (
    <div className="space-y-2">
      <h2 className="font-semibold">Select Concert</h2>
      {concerts.map((concert) => (
        <div
          key={concert._id}
          className={`cursor-pointer p-2 border rounded hover:bg-gray-100 ${
            selectedConcert?._id === concert._id ? "bg-gray-200" : ""
          }`}
          onClick={() => setSelectedConcert(concert)}
        >
          {concert.name} ({concert.date})
        </div>
      ))}
    </div>
  );
};

export default ConcertSelector;
