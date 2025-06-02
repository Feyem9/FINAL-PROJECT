// import React from 'react';

// function QuickActions() {
//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-md space-y-5">
//       <div className="flex justify-between items-center">
//         <p className="text-gray-700">Leave - Want to take a leave?</p>
//         <button className="text-blue-600 hover:underline font-medium">Request</button>
//       </div>
//       <hr />
//       <div className="flex justify-between items-center">
//         <p className="text-gray-700">Complaint - Want to complain against someone?</p>
//         <button className="text-blue-600 hover:underline font-medium">Report</button>
//       </div>
//       <hr />
//       <div className="flex justify-between items-center">
//         <p className="text-gray-700">Need Help or Support?</p>
//         <button className="text-blue-600 hover:underline font-medium">Contact</button>
//       </div>
//     </div>
//   );
// }

// export default QuickActions;

import React from 'react';
import { PlayIcon, BookOpenIcon, MusicIcon, FileDownIcon } from 'lucide-react';

function QuickActions() {
  const actions = [
    { label: 'Start Practice Session', icon: <PlayIcon className="w-5 h-5" /> },
    { label: 'Review Sheet Music', icon: <MusicIcon className="w-5 h-5" /> },
    { label: 'Open Piano Theory Notes', icon: <BookOpenIcon className="w-5 h-5" /> },
    { label: 'Download Practice Material', icon: <FileDownIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Piano Actions</h3>
      <ul className="space-y-3 text-sm">
        {actions.map((action, index) => (
          <li key={index} className="flex items-center gap-3 text-blue-700 hover:text-blue-900 cursor-pointer">
            {action.icon}
            <span>{action.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuickActions;
