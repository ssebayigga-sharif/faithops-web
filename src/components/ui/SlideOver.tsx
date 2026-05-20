import { ReactNode } from "react";
import {
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@carbon/react";

type SlideOverProps = {
  open: boolean;
  title: string;
  eyebrow?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  width?: "md" | "lg";
  closeOnOverlayClick?: boolean;
};

export function SlideOver({
  open,
  title,
  eyebrow,
  description,
  children,
  footer,
  onClose,
  width = "md",
  closeOnOverlayClick = true,
}: SlideOverProps) {
  return (
    <ComposedModal
      className="slide-over-modal"
      containerClassName={`slide-over-modal__container slide-over-modal__container--${width}`}
      open={open}
      onClose={onClose}
      preventCloseOnClickOutside={!closeOnOverlayClick}
      size={width}
    >
      <ModalHeader title={title} label={eyebrow} />

      <ModalBody hasScrollingContent>
        {description && (
          <p className="slide-over__description">{description}</p>
        )}
        {children}
      </ModalBody>

      {footer && <ModalFooter>{footer}</ModalFooter>}
    </ComposedModal>
  );
}
