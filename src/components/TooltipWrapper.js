import React from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import styled from "styled-components";

const TooltipContent = styled(RadixTooltip.Content)`
  background: hsla(0, 0%, 0%, 0.75);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5em 1em;
  font-size: 85%;
  z-index: 1;
`;

/**
 * Tooltip wrapper that mimics @reach/tooltip API for easier migration
 * Props:
 * - label: tooltip content (text or element)
 * - children: trigger element
 * - className: for styled-components compatibility (applied to content)
 */
const Tooltip = React.forwardRef(({ label, children, className, ...props }, ref) => {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root delayDuration={0}>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <TooltipContent ref={ref} className={className} sideOffset={5} {...props}>
            {label}
            <RadixTooltip.Arrow />
          </TooltipContent>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
});

Tooltip.displayName = "Tooltip";

export default Tooltip;
