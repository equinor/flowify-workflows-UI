import { Observable, Subscription } from 'rxjs';

/**
 * RetryObservable allows you to watch for changes, automatically reconnecting on error.
 */
export class RetryObservable<E, V> {
    private readonly watch: (v: V) => Observable<E>;
    private readonly onOpen: () => void;
    private readonly onItem: (event: E) => void;
    private readonly onError: (error: Error) => void;
    private subscription: Subscription | undefined;
    private timeout: any; // should be `number`

    private reconnectAfterMs = 5000;

    constructor(
        watch: (v?: V) => Observable<E>,
        onOpen: () => void, //  called when watches (re-)established after error, so should clear any errors
        onEvent: (event: E) => void, // called whenever item is received,
        onError: (error: Error) => void
    ) {
        this.watch = watch;
        this.onOpen = onOpen;
        this.onItem = onEvent;
        this.onError = onError;
    }

    public start(v: V) {
        this.stop();
        this.subscription = this.watch(v).subscribe({
            next: (next) => {
                if (next) {
                    this.onItem(next);
                } else {
                    this.onOpen();
                }
            },
            error: (error) => {
                this.stop();
                this.onError(error);
                this.timeout = setTimeout(() => this.start(v), this.reconnectAfterMs);
            },
            complete: () => { }
        });
    }

    // Must invoke on component unload.
    public stop() {
        clearTimeout(this.timeout);
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}