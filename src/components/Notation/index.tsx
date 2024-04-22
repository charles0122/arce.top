import {RoughNotation, RoughNotationGroup, RoughNotationProps} from 'react-rough-notation';
import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import TrackVisibility,{TrackVisibilityProps} from 'react-on-screen';

const ComponentToTrack = ({isVisible}) => {
  const style = {
    background: isVisible ? 'red' : 'blue',
  };
  return <div style={style}>Hello</div>;
};

enum bracketDirection{
  'right',
  'top',
  'down',
  'left'
}

// interface NotationProps {
//   once?: boolean;
//   throttleInterval?: number;
//   style?: object;
//   className?: string;
//   offset?: number;
//   partialVisibility?: boolean;
//   tag?: string;
//   children: any;
//   type: 'underline' | 'box' | 'circle' | 'highlight' | 'strike-through' | 'crossed-off';
//   padding: number | number[];
//   brackets: bracketDirection | bracketDirection[];
//   show:boolean;
//   strokeWidth:number;
//   order: string | number
// }

export default function Notation(props1,props2): React.Element<RoughNotationProps,TrackVisibilityProps> {
  // const show = true;
  // const {
  //   once = true,
  //   throttleInterval,
  //   style,
  //   className,
  //   offset = 500,
  //   partialVisibility,
  //   tag,
  //   children,
  //   type,
  //   show = true,
  //   animate=true,
  //   animationDelay = 0,
  //   animationDuration = 800,
  //   brackets = "right",
  //   color,
  //   multiline = false,
  //   order,
  //   padding = 2,
  //   strokeWidth =1,

  // } = props;

  return (
    <TrackVisibility {...props2}>
      {
        <RoughNotation {...props1}>
        </RoughNotation>
      }
    </TrackVisibility>
  );
  //    return <TrackVisibility once offset={3000}>
  //    {({ isVisible }) => isVisible && <ComponentToTrack isVisible/> }
  // </TrackVisibility>
}
