<!-- Project Comments Go Here -->

### Intro
This was a very fun tech test to do! SO nice to have a Figma file to work from (albeit just an image) and very nicely structured.

#### Timings
I started the project roughly around 16:05 and finished at 17:58 any additional time was taken to write these comments and push the project.

### TDD
In the interest of time I did not TDD this application.

### Approach
I started with the API hook, it made the most sense to me to abstract this logic into a hook and keep the main Applications component and sub-components resonsible primarily for rendering and formatting.

The hook is basic with some very rudimentary error handling, in production I would definitely add some retry logic with exponential backoff (early in my time at EF I created a helper library for this so now we just import the package for consistency) Abort controllers could be a good addition too.

I then wanted to get through some of the styling (bold text, removal of vertical dividers, blue & mailto emails which was all very basic) and the currency/date formatting; currency was straightforward using TS inbuilt i18n, I couldn't do the same thing with the dates as they used hyphen separators.

Tests were the logical next step so I added some here. **I used AI to help me write these tests**, this is standard practice at EF and I felt it appropriate to use here especially given the times. We are quite heavy on the tests across the stack and I feel AI is an excellent tool for vastly improving the speed of quite a mundane (to me) process. This also gave me a little time to do some mobile styling and refactoring.

