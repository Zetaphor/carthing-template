export enum Button {
  BUTTON_1,
  BUTTON_2,
  BUTTON_3,
  BUTTON_4,
  BUTTON_5,
  SCROLL_LEFT,
  SCROLL_RIGHT,
  SCROLL_PRESS,
  FRONT_BUTTON,
}

export enum EventType {
  Down,
  Up,
  Long,
  Short,
}

// Add constants for timing
const LONG_PRESS_DURATION = 500; // milliseconds

function mapButton(event: string): Button {
  switch (event) {
    case 'Digit1':
      return Button.BUTTON_1;
    case 'Digit2':
      return Button.BUTTON_2;
    case 'Digit3':
      return Button.BUTTON_3;
    case 'Digit4':
      return Button.BUTTON_4;
    case 'KeyM':
      return Button.BUTTON_5;
    case 'Enter':
      return Button.SCROLL_PRESS;
    case 'Escape':
      return Button.FRONT_BUTTON;
    default:
      throw new Error("I don't know this button");
  }
}

function listenerKey(btn: Button, flv: EventType): string {
  return `${btn}_${flv}`;
}

export default class ButtonHelper {
  private listeners: Map<string, ((btn: Button, flv: EventType) => void)[]>;
  private buttonPressStartTimes: Map<Button, number>;
  private longPressTimeouts: Map<Button, NodeJS.Timeout>;

  constructor() {
    this.listeners = new Map();
    this.buttonPressStartTimes = new Map();
    this.longPressTimeouts = new Map();

    document.addEventListener('wheel', this.wheelEventHandler);
    document.addEventListener('keydown', this.keyDownEventHandler);
    document.addEventListener('keyup', this.keyUpEventHandler);
  }

  addListener(btn: Button, flv: EventType, fn: (btn: Button, flv: EventType) => void): void {
    const currentListeners = this.listeners.get(listenerKey(btn, flv)) || [];
    this.listeners.set(listenerKey(btn, flv), [...currentListeners, fn]);
  }

  private wheelEventHandler = (event: WheelEvent) => {
    if (event.deltaX < 0) {
      this.notify(Button.SCROLL_LEFT, EventType.Short);
    } else if (event.deltaX > 0) {
      this.notify(Button.SCROLL_RIGHT, EventType.Short);
    }
  };

  private notify(btn: Button, flv: EventType) {
    const currentListeners = this.listeners.get(listenerKey(btn, flv)) || [];
    for (const listener of currentListeners) {
      listener(btn, flv);
    }
  }

  private keyDownEventHandler = (event: KeyboardEvent) => {
    try {
      const button = mapButton(event.code);

      // Prevent repeat events
      if (this.buttonPressStartTimes.has(button)) {
        return;
      }

      this.buttonPressStartTimes.set(button, Date.now());
      this.notify(button, EventType.Down);

      // Set up long press timeout
      const timeout = setTimeout(() => {
        this.notify(button, EventType.Long);
        this.longPressTimeouts.delete(button);
      }, LONG_PRESS_DURATION);

      this.longPressTimeouts.set(button, timeout);

    } catch (_error) {
      console.log('Unmapped key:', event.code);
    }
  };

  private keyUpEventHandler = (event: KeyboardEvent) => {
    try {
      const button = mapButton(event.code);
      const pressStartTime = this.buttonPressStartTimes.get(button);

      // Clear any pending long press timeout
      const timeout = this.longPressTimeouts.get(button);
      if (timeout) {
        clearTimeout(timeout);
        this.longPressTimeouts.delete(button);
      }

      if (pressStartTime) {
        const pressDuration = Date.now() - pressStartTime;
        if (pressDuration < LONG_PRESS_DURATION) {
          this.notify(button, EventType.Short);
        }
      }

      this.buttonPressStartTimes.delete(button);
      this.notify(button, EventType.Up);

    } catch (_error) {
      console.log('Unmapped key:', event.code);
    }
  };
}