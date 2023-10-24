import { graphql, http } from 'msw';
import { setupServer } from 'msw/node';
import {
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
    test,
    vi,
} from 'vitest';
import {
    executeAfterTwoHours,
    executeEveryMinute,
    getLatest,
    messages,
    purchase,
    sum,
    toUpperCase,
} from './example-tests';

// Mock globals
const IntersectionObserverMock = vi.fn(() => {
    return {
        disconnect: vi.fn(),
        observe: vi.fn(),
        takeRecords: vi.fn(),
        unobserve: vi.fn(),
    };
});

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

// now you can access it as `IntersectionObserver` or `window.IntersectionObserver`

// Test cases

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});

it('toUpperCase', () => {
    const result = toUpperCase('foobar');
    expect(result).toMatchSnapshot();
});

describe('purchasing flow', () => {
    beforeEach(() => {
        // tell vitest we use mocked time
        vi.useFakeTimers();
    });

    afterEach(() => {
        // restoring date after each test run
        vi.useRealTimers();
    });

    it('allows purchases during business hours', () => {
        // set hour within business hours
        const date = new Date(2000, 1, 1, 13);
        vi.setSystemTime(date);

        expect(purchase()).toEqual({ message: 'Success' });
    });

    it('does not allow purchases outside of business hours', () => {
        // set hour outside of business hours
        const date = new Date(2000, 1, 1, 18);
        vi.setSystemTime(date);

        expect(purchase()).toEqual({ message: 'Error' });
    });
});

// Spying on functions

describe('reading messages', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should get the latest message with a spy', () => {
        const spy = vi.spyOn(messages, 'getLatest');
        expect(spy.getMockName()).toEqual('getLatest');

        expect(messages.getLatest()).toEqual(messages.items.at(-1));

        expect(spy).toHaveBeenCalledTimes(1);

        spy.mockImplementationOnce(() => 'access-restricted');
        expect(messages.getLatest()).toEqual('access-restricted');

        expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should get with a mock', () => {
        const mock = vi.fn().mockImplementation(getLatest);

        expect(mock()).toEqual(messages.items.at(-1));
        expect(mock).toHaveBeenCalledTimes(1);

        mock.mockImplementationOnce(() => 'access-restricted');
        expect(mock()).toEqual('access-restricted');

        expect(mock).toHaveBeenCalledTimes(2);

        expect(mock()).toEqual(messages.items.at(-1));
        expect(mock).toHaveBeenCalledTimes(3);
    });
});

// Mocking API requests

const posts = [
    {
        userId: 1,
        id: 1,
        title: 'first post title',
        body: 'first post body',
    },
    {
        userId: 2,
        id: 5,
        title: 'second post title',
        body: 'second post body',
    },
    {
        userId: 3,
        id: 6,
        title: 'third post title',
        body: 'third post body',
    },
];

const jsonPlaceHolder = graphql.link('https://jsonplaceholder.ir/graphql');
// Define handlers that catch the corresponding requests and returns the mock data.
export const handlers = [
    http.get('https://jsonplaceholder.typicode.com/posts', (_req, res, ctx) =>
        res(ctx.status(200), ctx.json(posts))
    ),

    jsonPlaceHolder.query('posts', (_req, res, ctx) =>
        res(
            ctx.data({
                posts,
            })
        )
    ),
];

const server = setupServer(...handlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());

// Timers
// eslint-disable-next-line no-console
const mock = vi.fn(() => console.log('executed'));

describe('delayed execution', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });
    it('should execute the function', () => {
        executeAfterTwoHours(mock);
        vi.runAllTimers();
        expect(mock).toHaveBeenCalledTimes(1);
    });
    it('should not execute the function', () => {
        executeAfterTwoHours(mock);
        // advancing by 2ms won't trigger the func
        vi.advanceTimersByTime(2);
        expect(mock).not.toHaveBeenCalled();
    });
    it('should execute every minute', () => {
        executeEveryMinute(mock);
        vi.advanceTimersToNextTimer();
        expect(mock).toHaveBeenCalledTimes(1);
        vi.advanceTimersToNextTimer();
        expect(mock).toHaveBeenCalledTimes(2);
    });
});
