# Findash: Your Personal Finance Dashboard

## Visit: https://findash-phi.vercel.app

Findash is a modern, intuitive user dashboard designed to help you track your cryptocurrency and stock investments in one place. It provides real-time market overviews, current asset prices, personalized watchlists, interactive charts for historical data visualization, and a comprehensive currency converter allowing conversions between any crypto and any local (fiat) currency.

## Features

- **Unified Dashboard:** A single, clean interface to monitor both your cryptocurrency and stock assets.
- **Market Overview:** Get a quick glance at broader market trends for both crypto and traditional stocks.
- **Real-time Price Tracking:** View current market prices for assets in your watchlist and across the broader market.
- **Personalized Watchlists:** Add your favorite cryptocurrencies and stocks to a dedicated watchlist for easy monitoring.
- **Interactive Charts:** Visualize historical price data for both cryptocurrencies and individual stocks, helping users identify trends and patterns.
- **Advanced Currency Converter:**
  - *Crypto to Local Currency:* Convert any supported cryptocurrency (e.g., Bitcoin, Ethereum) to your local fiat currency (e.g., NGN, USD, EUR, PKR).
  - *Local Currency to Crypto:* Convert any local fiat currency back into cryptocurrency.
  - *Crypto to Crypto:* Seamlessly convert between different cryptocurrencies (e.g., BTC to ETH).
- **User-Friendly Interface:** Designed for ease of use, providing essential information at a glance.
- **Responsive Design:** Optimized for a consistent experience across various devices.
- **Light and Dark Mode:** Switch between light and dark themes for optimal viewing comfort.

## Technologies Used

**Frontend:**
- **React:** Powerful JavaScript library for building dynamic user interfaces.
- **Tailwind CSS:** Highly customizable, utility-first CSS framework for rapid styling.
- **Vite:** Lightning-fast frontend build tool.
- **Charting Library:** (Chart.js and Recharts): Used for rendering interactive historical price charts.

**APIs:**
- **CoinGecko API:** Primary source for cryptocurrency data (prices, market overview, and lists of crypto assets) 
- **Fawazahmed0's Currency API:** Used for fetching fiat-to-fiat currency exchange rates (specifically for USD conversion to other fiats).
- **Finnhub API (or similar):** Utilized for fetching real-time stock market data and historical data for charts. 

## Getting Started

Follow these instructions to set up Findash on your local machine for development and testing.

### Prerequisites

- Node.js (LTS version recommended)
- npm or Yarn (package manager)

### Installation

Clone the repository:
```bash
git clone https://github.com/Gogo602/FinDash.git
cd Findash
```

Install dependencies:
```bash
npm install
# or
yarn install
```

### Set up API Keys

Findash relies on external APIs to fetch real-time data. You'll need to obtain API keys from the respective providers and set them up as environment variables.

1. **CoinGecko API Key:** Obtain your key from the CoinGecko API website.
2. **Finnhub API Key (or your chosen Stock API):** Obtain your key from the Finnhub website (or your chosen stock API provider).

Create a `.env` file in the root of your project (if it doesn't already exist) and add your API keys:
```
VITE_COINGECKO_API_KEY=YOUR_COINGECKO_API_KEY_HERE
VITE_FINNHUB_API_KEY=YOUR_FINNHUB_API_KEY_HERE
# Add other API keys if you use them (e.g., VITE_ALPHA_VANTAGE_API_KEY)
```
**Important:** Replace `YOUR_COINGECKO_API_KEY_HERE` and `YOUR_FINNHUB_API_KEY_HERE` with your actual keys. For Vite, environment variables must be prefixed with `VITE_` to be accessible in your frontend code.

### Running the Project

Start the development server:
```bash
npm run dev
# or
yarn dev
```
Open your web browser and navigate to [http://localhost:5173](http://localhost:5173) (or the address provided in your terminal).


## How the Universal Converter Works

The currency converter in Findash supports "any-to-any" conversions (Crypto A to Crypto B, Crypto to Fiat, Fiat to Crypto, and Fiat to Fiat) by leveraging a USD-intermediated conversion strategy:


## Contributing

We welcome contributions to Findash! If you have ideas for new features, bug fixes, or improvements, please feel free to:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-awesome-feature`).
3. Make your changes and ensure they are well-tested.
4. Commit your changes (`git commit -m 'feat: Add new awesome feature'`).
5. Push to the branch (`git push origin feature/your-awesome-feature`).
6. Open a Pull Request, describing your changes in detail.

## License

This project is available under the MIT License.

