import  { useState, useEffect } from 'react';
import useCurrencyInfo from '../../hook/useCurrencyinfo.js';
import { InputBox } from './index.js';

const Convert = () => {
  const [amount, setAmount] = useState(0);
  const [from, setFrom] = useState('usd');
  const [to, setTo] = useState('pkr');
  const [convertedAmount, setconvertedAmount] = useState(0);

  const currencyInfo = useCurrencyInfo(from);
  const options = Object.keys(currencyInfo);

  const handleAmountChange = (newValue) => {
    console.log('Convert: Amount changed:', newValue);
    setAmount(newValue);
  };

  useEffect(() => {
    console.log('Convert: Current amount state:', amount);
  }, [amount]);

  const convert = () => {
    setconvertedAmount(amount * currencyInfo[to]);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
    setconvertedAmount(amount);
    setAmount(convertedAmount);
  };

  return (
    <div
      className="w-full h-screen flex flex-wrap  dark:text-gray-900 justify-center items-center bg-cover bg-no-repeat">
      <div className="w-full">
        <div className="w-full max-w-md mx-auto border border-gray-50 rounded-lg p-5 backdrop-blur-sm bg-white/30">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              convert();
            }}
            >
            <div className="w-full mb-1">
              <InputBox
                label="from"
                amount={amount}
                currencyOptions={options}
                onCurrencychange={(currency) => setFrom(currency)}
                onAmountChange={handleAmountChange}
                selectedCurrency={from}
              />
            </div>
            <div className="relative w-full h-0.5">
              <button
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-md bg-blue-500 text-white px-2 py-0.5"
                onClick={swap}
              >
                Swap
              </button>
            </div>
            <div className="w-full mb-1">
              <InputBox
                label="to"
                amount={convertedAmount}
                amountdisabled={true}
                currencyOptions={options}
                onCurrencychange={(currency) => setTo(currency)}
                selectedCurrency={to}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg font-bold"
            >
              CONVERT {from.toUpperCase()} to {to.toUpperCase()}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Convert;