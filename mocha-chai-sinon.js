/**

- Mocha:

- Chai:
    assert, expect, should;
- Sinon:
    stubs, mocks and spies;


================================================================


1. Spies

Purpose: To track function calls and verify how they were called
Use when: You want to ensure a function was called with specific arguments or a certain number of times
Key features:

Don't change the function's behavior
Can track number of calls, arguments, return values
Good for verification without modifying behavior




2. Stubs

Purpose: To replace a function with a predefined behavior
Use when: You want to:

Control a function's return values
Force specific code paths (like error handling)
Avoid actual external calls (API, database, etc.)


Key features:

Return preset values
Can be programmed to behave differently based on arguments
Don't care about verification (though they can do it)




3. Mocks

Purpose: To combine stubbing with pre-programmed expectations
Use when: You need to:

Verify complex interactions
Ensure specific call sequences
Set up strict expectations about how code should be used


Key features:

Include built-in verification
More rigid than spies or stubs
Best for testing interaction patterns




Key Differences:

Spies observe behavior without changing it
Stubs provide canned answers without verification
Mocks combine fake behavior with expectations
 */