import { useEffect, useState } from 'react';
import { Button } from '@extension/ui';
import { useStorage } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { X, ChevronUp, ChevronDown, Check } from 'lucide-react';

export default function App() {
  const theme = useStorage(exampleThemeStorage);

  useEffect(() => {
    console.log('content ui loaded');
  }, []);

  const [isExpanded, setIsExpanded] = useState(false);
  const [preferences, setPreferences] = useState({
    'have an account': true,
    '100+ followers': false,
    '10+ posts': false,
  });

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const handlePreferenceChange = (key: string) => {
    console.log('Preference changed:', key);
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('initial'); // 'initial', 'loading', 'completed'

  const handleAccept = () => {
    console.log('Preferences saved:', preferences);
    setStatus('loading');
    // Simulate loading process
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setStatus('completed');
          return 100;
        }
        return prevProgress + 1;
      });
    }, 20);
    // Here you would typically save the preferences and close the component
  };

  const presentAttributes = () => {
    console.log('Attributes presented:', preferences);
    // Here you would typically present the attributes to the server
    exampleThemeStorage.toggle();
  };

  const currentURL = window.location.href;

  return (
    <>
      {currentURL.includes('https://bonkcoin.com/') ? (
        <div className="fixed bottom-4 right-4 w-80 bg-stone-900 text-white rounded-lg shadow-lg overflow-hidden z-[100]">
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">Pickup $BONK COIN</h2>
            </div>
            {status === 'initial' && (
              <p className="text-sm mb-4">
                You can receive $Bonk in exchange for providing attribute information. Personal information will not be
                shared.
              </p>
            )}
            {status === 'loading' && (
              <div className="mb-4">
                <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
                  <div className="bg-orange-600 h-4 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-sm text-center">Loading {progress}%</p>
              </div>
            )}
            {status === 'completed' && (
              <div className="flex items-center justify-center mb-4">
                <Check size={24} className="text-green-500 mr-2" />
                <p className="text-sm font-semibold">Generation completed!!</p>
              </div>
            )}
            <div className="space-y-2 mb-4">
              {Object.entries(preferences).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{key}</span>
                  <div className="flex items-center">
                    <div className="relative">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          value=""
                          className="sr-only peer"
                          checked={value}
                          onChange={() => handlePreferenceChange(key)}
                          disabled={key === 'necessary'}
                        />
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                      </label>
                    </div>
                    <div className="text-sm ml-2">10$BONK</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleAccept}
                className="bg-gray-700 text-white py-2 px-4 rounded-full text-sm hover:bg-gray-600 transition duration-300">
                Close
              </button>
              <button
                onClick={presentAttributes}
                className="bg-orange-600 text-white py-2 px-4 rounded-full text-sm hover:bg-orange-700 transition duration-300">
                Present Attributes
              </button>
            </div>
          </div>
        </div>
      ) : (
        <></>
        // <div className="fixed bottom-4 right-4 w-80 bg-stone-900 text-white rounded-lg shadow-lg overflow-hidden">
        //   <div className="p-4">
        //     <div className="flex justify-between items-center mb-2">
        //       <h2 className="text-lg font-bold">Pickup ZKProof</h2>
        //       {/* <button onClick={toggleExpanded} className="text-gray-400 hover:text-white">
        //     {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        //   </button> */}
        //     </div>
        //     {status === 'initial' && (
        //       <p className="text-sm mb-4">You can create a zkTLS proof and make your private data portable!</p>
        //     )}
        //     {status === 'loading' && (
        //       <div className="mb-4">
        //         <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
        //           <div className="bg-orange-600 h-4 rounded-full" style={{ width: `${progress}%` }}></div>
        //         </div>
        //         <p className="text-sm text-center">Loading {progress}%</p>
        //       </div>
        //     )}
        //     {status === 'completed' && (
        //       <div className="flex items-center justify-center mb-4">
        //         <Check size={24} className="text-green-500 mr-2" />
        //         <p className="text-sm font-semibold">Generation completed!!</p>
        //       </div>
        //     )}
        //     <div className="space-y-2 mb-4">
        //       {Object.entries(preferences).map(([key, value]) => (
        //         <div key={key} className="flex items-center justify-between">
        //           <span className="text-sm capitalize">{key}</span>

        //           <div className="relative">
        //             <label className="inline-flex items-center cursor-pointer">
        //               <input
        //                 type="checkbox"
        //                 value=""
        //                 className="sr-only peer"
        //                 checked={value}
        //                 onChange={() => handlePreferenceChange(key)}
        //                 disabled={key === 'necessary'}
        //               />
        //               <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
        //             </label>
        //           </div>
        //         </div>
        //       ))}
        //     </div>

        //     <div className="flex justify-between">
        //       <button
        //         onClick={handleAccept}
        //         className="bg-gray-700 text-white py-2 px-4 rounded-full text-sm hover:bg-gray-600 transition duration-300">
        //         Close
        //       </button>
        //       <button
        //         onClick={handleAccept}
        //         className="bg-orange-600 text-white py-2 px-4 rounded-full text-sm hover:bg-orange-700 transition duration-300">
        //         Generate Proof
        //       </button>
        //     </div>
        //   </div>
        // </div>
      )}
    </>
  );
}
