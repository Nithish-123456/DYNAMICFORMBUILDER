// import React from 'react';
// import { useForm } from '../../context/FormContext';
// import { Eye, Edit3 } from 'lucide-react';

// export function PreviewButton() {
//   const { state, dispatch } = useForm();
//   const { previewMode } = state;

//   const togglePreview = () => {
//     dispatch({ type: 'TOGGLE_PREVIEW' });
//   };

//   return (
//     <button
//       onClick={togglePreview}
//       className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
//         previewMode
//           ? 'bg-blue-600 text-white hover:bg-blue-700'
//           : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//       }`}
//     >
//       {previewMode ? (
//         <>
//           <Edit3 size={18} />
//           Edit Mode
//         </>
//       ) : (
//         <>
//           <Eye size={18} />
//           Preview
//         </>
//       )}
//     </button>
//   );
// }