declare module "react-idle-timer" {
  import * as React from "react";

  class IdleTimer extends React.Component<IdleTimerProps> {
    /**
     * Restore initial state and restart timer
     */
    reset(): void;

    /**
     * Store remaining time and stop timer
     */
    pause(): void;

    /**
     * Resumes a paused timer
     */
    resume(): void;

    /**
     * Time remaining before idle (number of ms)
     */
    getRemainingTime(): number;

    /**
     * How much time has elapsed (timestamp)
     */
    getElapsedTime(): number;

    /**
     * Last time the user was active
     */
    getLastActiveTime(): number;

    /**
     * Returns wether or not the user is idle
     */
    isIdle(): boolean;
  }

  export interface IdleTimerProps {
    ref: (ref: IdleTimer) => any;

    /**
     * Activity Timeout in milliseconds default: 1200000
     */
    timeout?: number;

    /**
     * DOM events to listen to default: see [default events](https://github.com/SupremeTechnopriest/react-idle-timer#default-events)
     */
    events?: string[];

    /**
     * Element reference to bind activity listeners to default: document
     */
    element?: Node;

    /**
     * Start the timer on mount default: true
     */
    startOnMount?: boolean;

    /**
     * Bind events passively default: true
     */
    passive?: boolean;

    /**
     * Capture events default: true
     */
    capture?: boolean;

    /**
     * Function to call when user becomes active
     */
    onActive?: (e: Event) => void;

    /**
     * Function to call when user is idle
     */
    onIdle?: (e: Event) => void;

        /**
     * Function to call when user is idle
     */
    onAction?: (e: Event) => void;
  }

  export default IdleTimer;
}
