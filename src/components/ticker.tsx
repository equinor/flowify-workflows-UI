import { useEffect, useRef, useState } from "react";

export interface TickerProps {
    interval: number,
    children : any
}

export const Ticker: React.FC<TickerProps> = ({
    interval,
    children
  }: TickerProps): React.ReactElement => {

    const [res, setResult] = useState(children());

    useInterval(() => {
        setResult(children());
      }, interval);

  return (
    <>
    {res}
    </>
  );
};

function useInterval(callback: () => void, delay: number) {
    const savedCallback = useRef(callback);
  
    useEffect(() => {
      savedCallback.current = callback;
    });
  
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
  
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }, [delay]);
  }