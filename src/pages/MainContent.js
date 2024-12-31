import React from "react";

const MainContent = () => {
  return (
    <div className="flex min-h-screen">



      {/* Main Content Section */}
      <div className="flex-1">
        {/* Header only for Dashboard */}


        {/* Main content area */}
        <main className="bg-gray-50 p-6 pt-20"> {/* Added pt-20 to account for the fixed header */}

          {/* Add your content here */}
        </main>
      </div>
    </div>
  );
};

export default MainContent;
