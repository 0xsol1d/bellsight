import React, { useEffect, useState, memo } from 'react';

const TradingViewWidget: React.FC = () => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (container) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "autosize": false,
          "symbol": "COINEX:BELLSCOINUSDT",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "hide_side_toolbar": false,
          "allow_symbol_change": false,
          "calendar": false,
          "hide_volume": true,
          "support_host": "https://www.tradingview.com"
        }`;
      container.appendChild(script);
    }
  }, [container]);

  return (
    <div
      className="tradingview-widget-container"
      ref={setContainer}
      style={{ height: 500, width: "100%" }}
    >
      <div className="tradingview-widget-container__widget" style={{ height: 500, width: "100%" }}></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
};

export default memo(TradingViewWidget);