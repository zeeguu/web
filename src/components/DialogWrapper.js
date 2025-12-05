import React from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import styled from "styled-components";

const Overlay = styled(RadixDialog.Overlay)`
  background: hsla(0, 0%, 0%, 0.33);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const Content = styled(RadixDialog.Content)`
  background: white;
  padding: 2rem;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 85vh;
  overflow: auto;
  outline: none;

  &:focus {
    outline: none;
  }
`;

/**
 * Dialog wrapper that mimics @reach/dialog API for easier migration
 * Props:
 * - onDismiss: called when overlay clicked or Escape pressed
 * - aria-label: accessibility label for the dialog
 * - children: dialog content
 * - className: for styled-components compatibility
 * - any other props are passed to the Content element
 */
const Dialog = React.forwardRef(
  ({ onDismiss, children, className, ...props }, ref) => {
    return (
      <RadixDialog.Root open={true} onOpenChange={(open) => !open && onDismiss?.()}>
        <RadixDialog.Portal>
          <Overlay />
          <Content ref={ref} className={className} {...props}>
            {children}
          </Content>
        </RadixDialog.Portal>
      </RadixDialog.Root>
    );
  }
);

Dialog.displayName = "Dialog";

export { Dialog };
