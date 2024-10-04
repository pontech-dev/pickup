import '@src/Popup.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { useState, type ComponentPropsWithoutRef } from 'react';
import { DollarSign, Grid, ArrowLeftRight, Zap, Globe, AlertCircle, Info, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { Connection, clusterApiUrl, Keypair } from '@solana/web3.js';

const notificationOptions = {
  type: 'basic',
  iconUrl: chrome.runtime.getURL('icon-34.png'),
  title: 'Injecting content script error',
  message: 'You cannot inject script here!',
} as const;

const Popup = () => {
  const [balance, setBalance] = useState(3.89);
  const [change, setChange] = useState(0.02);
  const [changePercent, setChangePercent] = useState(0.62);

  const currencies = [
    { name: 'USD Coin', symbol: 'USDC', amount: 3.36642, value: 3.36, change: 0.01 },
    { name: 'Solana', symbol: 'SOL', amount: 0.00445, value: 0.48, change: 0.02 },
    { name: 'GMT', symbol: 'GMT', amount: 23.53754, value: null, change: null },
    { name: 'Bonk!', symbol: 'BONK', amount: 10, value: 0.01, change: 0.01 },
  ];
  const theme = useStorage(exampleThemeStorage);

  const keypair = Keypair.generate();
  console.log(keypair.secretKey);

  const isLight = theme === 'light';
  const logo = isLight ? 'popup/logo_vertical.svg' : 'popup/logo_vertical_dark.svg';
  const goGithubSite = () =>
    chrome.tabs.create({ url: 'https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite' });

  const injectContentScript = async () => {
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });

    if (tab.url!.startsWith('about:') || tab.url!.startsWith('chrome:')) {
      chrome.notifications.create('inject-error', notificationOptions);
    }

    await chrome.scripting
      .executeScript({
        target: { tabId: tab.id! },
        files: ['/content-runtime/index.iife.js'],
      })
      .catch(err => {
        // Handling errors related to other paths
        if (err.message.includes('Cannot access a chrome:// URL')) {
          chrome.notifications.create('inject-error', notificationOptions);
        }
      });
  };
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="max-w-xl mx-auto bg-stone-800 text-white h-screen">
      {theme === 'dark' ? (
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Ponta ({keypair.publicKey.toString().slice(0, 6)})...</h1>
            </div>
            <div className="w-8 h-8">{/* Placeholder for QR code icon */}</div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold">${balance.toFixed(2)}</h2>
            <p className="text-green-400">
              +${change.toFixed(2)} +{changePercent.toFixed(2)}%
            </p>
          </div>

          <div className="flex justify-between mb-6">
            <button className="bg-orange-600 text-white py-2 px-6 rounded-full">Deposit</button>
            <button className="bg-orange-600 text-white py-2 px-6 rounded-full">Send</button>
          </div>

          <div className="space-y-3">
            {currencies.map((currency, index) => (
              <div key={index} className="bg-stone-700 p-3 rounded-lg flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-700 rounded-full mr-3 flex items-center justify-center">
                    {currency.symbol === 'USDC' && <DollarSign size={16} />}
                    {currency.symbol === 'SOL' && <div className="text-xs">SOL</div>}
                    {currency.symbol === 'GMT' && <div className="text-xs">GMT</div>}
                    {currency.symbol === 'BONK' && <div className="text-xs">Bonk!</div>}
                    {currency.symbol === 'ORCA' && <div className="text-xs">?</div>}
                  </div>
                  <div>
                    <p className="font-bold">{currency.name}</p>
                    <p className="text-sm text-gray-400">
                      {currency.amount} {currency.symbol}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {currency.value !== null ? (
                    <>
                      <p className="font-bold">${currency.value.toFixed(2)}</p>
                      <p className="text-sm text-green-400">+${currency.change.toFixed(2)}</p>
                    </>
                  ) : (
                    <p className="font-bold">-</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="max-w-sm mx-auto bg-stone-900 text-white rounded-3xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="w-20 h-20 bg-stone-800 rounded-3xl mx-auto mb-4"></div>
              <h1 className="text-2xl font-bold text-center mb-1">Approve Transaction</h1>
              <p className="text-stone-400 text-center mb-6">localhost:3000</p>

              <div className="bg-stone-800 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold">Estimated Balance Changes</span>
                  <Info size={20} className="text-gray-400" />
                </div>
                <div className="bg-stone-700 rounded p-2 mb-2">
                  <p className="text-red-500">Transaction may fail to confirm</p>
                </div>
                <div className="flex justify-between items-center bg-stone-700 rounded p-2">
                  <div className="flex items-center">
                    <Info size={16} className="text-gray-400 mr-2" />
                    <span>Network Fee</span>
                  </div>
                  <span>&lt; 0.00001 SOL</span>
                </div>
              </div>

              <button
                className="w-full text-gray-400 text-sm mb-6 focus:outline-none"
                onClick={() => setShowAdvanced(!showAdvanced)}>
                <div className="flex items-center justify-center">
                  <span>View advanced transaction details</span>
                  <ChevronDown size={16} className="ml-1" />
                </div>
              </button>

              {showAdvanced && (
                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-400">Advanced transaction details would be shown here.</p>
                </div>
              )}

              <div className="flex space-x-4">
                <button className="flex-1 bg-stone-700 text-white py-3 rounded-lg font-semibold hover:bg-stone-600 transition duration-300">
                  Cancel
                </button>
                <button
                  onClick={exampleThemeStorage.toggle}
                  className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition duration-300">
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    // <div className={`App ${isLight ? 'bg-slate-50' : 'bg-gray-800'}`}>
    //   <header className={`App-header ${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
    //     <button onClick={goGithubSite}>
    //       <img src={chrome.runtime.getURL(logo)} className="App-logo" alt="logo" />
    //     </button>
    //     <p>Edit aaaaaaaaa</p>
    //     <button
    //       className={
    //         'font-bold mt-4 py-1 px-4 rounded shadow hover:scale-105 ' +
    //         (isLight ? 'bg-blue-200 text-black' : 'bg-gray-700 text-white')
    //       }
    //       onClick={injectContentScript}>
    //       Click to inject Content Script
    //     </button>
    //     <ToggleButton>Toggle theme</ToggleButton>
    //   </header>
    // </div>
  );
};

const ToggleButton = (props: ComponentPropsWithoutRef<'button'>) => {
  const theme = useStorage(exampleThemeStorage);
  return (
    <button
      className={
        props.className +
        ' ' +
        'font-bold mt-4 py-1 px-4 rounded shadow hover:scale-105 ' +
        (theme === 'light' ? 'bg-white text-black shadow-black' : 'bg-black text-white')
      }
      onClick={exampleThemeStorage.toggle}>
      {props.children}
    </button>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
