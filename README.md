# Simplified Blackjack Project

## Steps to run locally

1. clone the repo
2. in the new directory:
   `pnpm install`
3. (optional) run tests:
   `pnpm run test`
4. start the dev server
   `pnpm run dev`
5. navigate to [localhost:3000](http://localhost:3000)

## Notes

### Structure

Some of the structure is fairly arbitrary in terms of where to put type, constant, and helper definitions. My usual preference is to let the emergent structure of a new project organically make the right choice obvious, but at such a small scale that didn't have a chance to coalesce.

### Theoretical Next Steps

- There's a touch of jank in a couple of the animations that I'd love to touch up
- I don't like the way I abstracted the Game Context from the Deck Provider and then the underlying service. There's a cleaner abstraction to be had there. A better abstraction would allow for more unit test coverage and establishing simple, dependency-injectable integration tests
- I built the win and loss condition setup for easy extensibility, so all it would take to create real Blackjack would be adding some logic to dealer actions, betting, and a couple more conditions
