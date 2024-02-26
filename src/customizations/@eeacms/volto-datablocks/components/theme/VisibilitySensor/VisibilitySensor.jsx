import React, { useState, useEffect } from 'react';
import ReactVisibilitySensor from 'react-visibility-sensor';
import { flushSync } from 'react-dom';

const usePrint = () => {
  const [isPrint, setIsPrint] = useState(false);

  /**
   * Use instead of window.print because window.print does not wait for react-rerender
   */
  function print() {
    flushSync(() => {
      setIsPrint(true);
      window.print();
    });
  }

  useEffect(() => {
    const beforePrint = () => {
      flushSync(() => {
        setIsPrint(true);
      });
    };
    const afterPrint = () => {
      flushSync(() => {
        setIsPrint(false);
      });
    };

    if (window.matchMedia) {
      const mediaQueryList = window.matchMedia('print');
      const handleMediaChange = (event) => {
        event.preventDefault();
        if (event.matches) {
          beforePrint();
        } else {
          afterPrint();
        }
      };

      try {
        mediaQueryList.addEventListener('change', handleMediaChange);
      } catch (error) {
        try {
          mediaQueryList.addListener(handleMediaChange);
        } catch (error) {
          console.debug('Error', error);
        }
      }

      setIsPrint(mediaQueryList.matches);

      return () => {
        try {
          mediaQueryList.removeEventListener('change', handleMediaChange);
        } catch (error) {
          try {
            mediaQueryList.removeListener(handleMediaChange);
          } catch (error) {
            console.debug('Error', error);
          }
        }
      };
    }

    // Fallback for browsers that don't support matchMedia
    window.onbeforeprint = beforePrint;
    window.onafterprint = afterPrint;

    // Cleanup function for the fallback
    return () => {
      window.onbeforeprint = null;
      window.onafterprint = null;
    };
  }, [setIsPrint]);

  return { isPrint, print };
};

const VisibilitySensor = ({
  children,
  scrollCheck = true,
  resizeCheck = true,
  partialVisibility = true,
  delayedCall = true,
  offset = { top: -50, bottom: -50 },
  useVisibilitySensor = true,
  Placeholder = () => <div>&nbsp;</div>,
  ...rest
}) => {
  const { isPrint } = usePrint();
  const [active, setActive] = React.useState(isPrint);
  // const [active, setActive] = React.useState(useVisibilitySensor);

  return (
    <ReactVisibilitySensor
      scrollCheck={scrollCheck}
      resizeCheck={resizeCheck}
      partialVisibility={partialVisibility}
      delayedCall={delayedCall}
      onChange={(visible) => {
        if (visible && active) {
          setActive(false);
        }
      }}
      active={active}
      getDOMElement={(val) => {
        return val?.el;
      }}
      offset={offset}
      {...rest}
    >
      {({ isVisible }) => {
        if (isVisible || !active) {
          return children;
        }

        return <Placeholder {...rest} />;
      }}
    </ReactVisibilitySensor>
  );
};

export default VisibilitySensor;
