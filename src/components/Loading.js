import React from 'react';

const Loading = ({ fullPage = false }) => {
  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="text-center">
          <div className="loader mx-auto mb-4"></div>
          <p className="text-neutral-500 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="loader mx-auto mb-4"></div>
        <p className="text-neutral-500 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
