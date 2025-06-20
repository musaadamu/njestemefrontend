import React from "react";

export default function EditorialBoard() {
  return (
    <div className="editorial-board-container min-h-screen bg-gray-50 text-gray-900 p-6">
      <h1 className="editorial-board-title text-3xl font-bold mb-6">Editorial Board</h1>
      <p className="editorial-board-description mb-4">
        Welcome to the Editorial Board page. Here you can find information about the members of the editorial board who oversee the quality and integrity of the journal.
      </p>
      {/* Placeholder for editorial board members list */}
      <ul className="editorial-board-list list-disc list-inside">
        <li>Dr. Jane Doe - Editor-in-Chief</li>
        <li>Prof. John Smith - Associate Editor</li>
        <li>Dr. Alice Johnson - Editorial Board Member</li>
        <li>Dr. Bob Williams - Editorial Board Member</li>
      </ul>
    </div>
  );
}
