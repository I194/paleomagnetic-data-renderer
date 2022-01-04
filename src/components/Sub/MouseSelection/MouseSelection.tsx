import React, { FC } from 'react';
import { OnSelectionChange, useSelectionContainer } from 'react-drag-to-select';
import { UseSelectionContainerParams } from 'react-drag-to-select/dist/hooks/useSelectionContainer';

// export interface MouseSelectionProps extends Pick<UseSelectionContainerParams<HTMLElement>, 'onSelectionChange'> {}

export interface MouseSelectionProps {
  onSelectionChange: OnSelectionChange;
  // onSelectionEnd: any//() => void;
  eventsElement?: HTMLElement | Window | null;
}

const MouseSelection: FC<MouseSelectionProps> = ({ onSelectionChange, eventsElement }) => {
  console.log(eventsElement)

  const { DragSelection } = useSelectionContainer({
    eventsElement: eventsElement ? eventsElement : document.getElementById('root'),
    // eventsElement: document.getElementById('root'),
    onSelectionChange,
    onSelectionStart: () => {
      console.log('OnSelectionStart');
    },
    onSelectionEnd: () => {
      console.log('OnSelectionEnd');
    },
    selectionProps: {
      style: {
        border: '2px dashed purple',
        borderRadius: 2,
        opacity: 0.5,
      },
    },
  });

  return <DragSelection />;
};

export default React.memo(MouseSelection);