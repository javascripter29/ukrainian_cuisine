"use client";

import { Button, Dialog, Modal, ModalOverlay } from "react-aria-components";
import type { ReactNode } from "react";

type ModalSize = "xs" | "sm" | "md" | "lg" | "full" | "cover";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  size?: ModalSize;
  children: ReactNode | ((props: { onClose: () => void }) => ReactNode);
}

const CustomModal = ({
  isOpen,
  onClose,
  title,
  size = "md",
  children,
}: IProps) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <ModalOverlay
      className="modal__backdrop modal__backdrop--opaque"
      isDismissable
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
    >
      <Modal
        className="modal__container"
        data-placement="auto"
      >
        <Dialog
          aria-label={typeof title === "string" ? title : undefined}
          className={`modal__dialog modal__dialog--scroll-inside modal__dialog--${size}`}
          data-placement="auto"
        >
          {title && (
            <div className="modal__header border-b" data-slot="modal-header">
              <h3 className="text-xl text-background font-semibold">{title}</h3>
              <Button
                aria-label="Close"
                className="close-button close-button--default modal__close-trigger"
                onPress={onClose}
                slot="close"
              >
                <svg
                  aria-hidden="true"
                  data-slot="close-button-icon"
                  fill="none"
                  height={16}
                  role="presentation"
                  viewBox="0 0 16 16"
                  width={16}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M3.47 3.47a.75.75 0 0 1 1.06 0L8 6.94l3.47-3.47a.75.75 0 1 1 1.06 1.06L9.06 8l3.47 3.47a.75.75 0 1 1-1.06 1.06L8 9.06l-3.47 3.47a.75.75 0 0 1-1.06-1.06L6.94 8 3.47 4.53a.75.75 0 0 1 0-1.06Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  />
                </svg>
              </Button>
            </div>
          )}

          <div className="modal__body modal__body--scroll-inside" data-slot="modal-body">
            {typeof children === "function"
              ? children({ onClose })
              : children}
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
};

export default CustomModal;
