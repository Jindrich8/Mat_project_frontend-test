import { Modal, ModalProps } from "@mantine/core";
import { FC } from "react"
import styles from "./ModalCmpStyle.module.css";

interface Props extends ModalProps {

}

const classNames = {
    root:styles.modal,
    inner:styles.innerModal
};

const ModalCmp:FC<Props> = (props) => {
  return (
    <Modal classNames={classNames} {...props} />
  );
};

export { ModalCmp, type Props as ModalCmpProps };
