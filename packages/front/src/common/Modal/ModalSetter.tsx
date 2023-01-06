import styled from "@emotion/styled";
import Portal from "./Portal";
import { CSSTransition } from "react-transition-group";
import { useRecoilState, atom } from "recoil";

interface Props {
  selector?: string;
  children?: React.ReactNode;
}

export const modalState = atom({
  key: "modalState",
  default: {
    isOpen: false,
    content: <></>,
  },
});

const ModalSetter = ({ selector }: Props) => {
  const [{ isOpen, content }, setModal] = useRecoilState(modalState);

  const onClose = () => {
    setModal({ isOpen: false, content });
  };

  return (
    <CSSTransition in={isOpen} timeout={300} classNames="modal" unmountOnExit>
      <Portal selector={selector}>
        <Overlay>
          <Dim onClick={onClose} />
          {content}
        </Overlay>
      </Portal>
    </CSSTransition>
  );
};

const Overlay = styled.div({
  position: "fixed",
  zIndex: 10,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
const Dim = styled.div({
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
});

export default ModalSetter;
