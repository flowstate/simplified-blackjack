export { LossOverlay } from './LossOverlay';
export { StartOverlay } from './StartOverlay';
export { WinOverlay } from './WinOverlay';

export interface OverlayProps {
  enabled: boolean;
  onClose: () => void;
}
