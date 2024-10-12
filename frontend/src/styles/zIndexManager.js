export function placeOnTopOf(elementIndex) {
  return elementIndex + 1;
}
export function placeAtBottomOf(elementIndex) {
  return elementIndex - 1;
}

export const modalIndex = 100;

export const headerIndex = 50;
export const headerMenuDropDownIndex = placeOnTopOf(headerIndex);
export const toastNotifierIndex = placeOnTopOf(headerMenuDropDownIndex);

export const generalMenuIndex = 20;
export const popoverContentIndex = generalMenuIndex;
export const bottomBarIndex = placeOnTopOf(popoverContentIndex);

export const progressBarValueIndex = 2;

export const fixedButtonIndex = placeOnTopOf(progressBarValueIndex);

export const avatarRemoveSelectionXMarkIndex = 10;
